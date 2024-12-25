import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  nationality: { type: String, required: true },
});

UserSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=username%>' });

const User = mongoose.model('User', UserSchema);
export default User;
