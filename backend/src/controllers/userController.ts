import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      email,
      password: hashedPassword,
      phone
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.status(201).json({ token, firstName: user.firstName });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.json({ token, firstName: user.firstName });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};