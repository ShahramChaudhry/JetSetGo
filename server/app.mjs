import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { register, passport, ensureAuthenticated } from './auth.mjs';
import { PORT, SESSION_SECRET } from './config.mjs';
import connectDB from './db.mjs';
import itineraryRoutes from './routes/itineraryRoutes.js';
import visaRoutes from './routes/visaRoutes.js';
import Itinerary from './models/Itinerary.js';

connectDB();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/api/itineraries', itineraryRoutes);
app.use('/api/visa', visaRoutes);

// app.get('/register', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/register.html'));
// });

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  console.log('Logged-in user:', req.user); 
  res.status(200).json({ message: 'Login successful' });
});

// app.get('/register', (req, res) => {
//   res.sendFile(path.join(__dirname,  '../public/register.html'));
// });

// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/login.html')); // Serve login.html
// });

// app.get('/itineraries', ensureAuthenticated, (req, res) => {
//   res.redirect('/dashboard');
// });
// app.get('/create_itinerary', ensureAuthenticated, (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/createitinerary.html'));
// });

// app.get('/dashboard', ensureAuthenticated, (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/dashboard.html'));
// });

app.get('/api/itineraries/:id', ensureAuthenticated, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary details:', error.message);
    res.status(500).json({ message: 'Error fetching itinerary details' });
  }
});




app.delete('/api/itineraries/:id', async (req, res) => {
  const itineraryId = req.params.id;

  try {
    const result = await Itinerary.findByIdAndDelete(itineraryId);

    if (result) {
      res.status(200).send({ message: 'Itinerary deleted successfully' });
    } else {
      res.status(404).send({ error: 'Itinerary not found' });
    }
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).send({ error: 'Unable to delete itinerary due to a server error' });
  }
});



app.get('/profile', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname,  '../public/profile.html'));
});


app.get('/api/itineraries', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const itineraries = await Itinerary.find({ user: userId });
    res.json(itineraries); 
  } catch (error) {
    console.error('Error fetching itineraries:', error.message);
    res.status(500).json({ message: 'Error fetching itineraries' });
  }
});


app.post('/api/register', async (req, res) => {
  const { username, email, password, nationality } = req.body;
  try {
    const user = await register(username, email, password, nationality);
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Registration failed' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  console.log('Logged-in user:', req.user)
  res.status(200).json({ message: 'Login successful' });
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

app.get('/api/profile', ensureAuthenticated, (req, res) => {
  try {
    const user = req.user; 
    res.json({
      username: user.username,
      nationality: user.nationality || 'Not specified'
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

