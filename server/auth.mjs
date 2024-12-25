

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'USER NOT FOUND' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'PASSWORDS DO NOT MATCH' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const register = async (username, email, password, nationality) => {
  if (username.length <= 8 || password.length <= 8) {
    throw { message: 'USERNAME PASSWORD TOO SHORT' };
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw { message: 'USERNAME ALREADY EXISTS' };
  }
  if (!nationality || nationality.length !== 2) {
    throw new Error('Invalid nationality code');
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    nationality,
  });
  await user.save();
  return user;
};

const ensureAuthenticated = (req, res, next) => {
  console.log('Session user:', req.user);
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' });
  }
};

export {
  register,
  ensureAuthenticated,
  passport
};
