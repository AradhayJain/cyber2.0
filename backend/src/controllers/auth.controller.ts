import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role || 'investigator'
        }
      }
    });

    if (error) throw error;

    return res.status(201).json({ message: 'User registered successfully', data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return res.status(200).json({ message: 'Login successful', data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error during login' });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }
    
    // In a real application, you would verify the JWT here.
    // Supabase handles sessions securely on the client, but for backend validation:
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) throw error;
    
    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
};
