import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  phone?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
