import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Hardcoded secret key for testing
const SECRET_KEY = 'your-hardcoded-secret-key';

export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({ success: false, message: "User already exists with the same email" });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message:error.message, error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      SECRET_KEY, 
      { expiresIn: '60m' } 
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Some error occurred", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token').json({ success: true, message: "Logged out successfully" });
};

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized user!' });
  }

  try {

   
    const decoded = jwt.verify(token, SECRET_KEY); 


    req.auth = { userId: decoded.id };
        next();
  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'TokenExpiredError') {
      console.error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.error('Invalid token');
    }

    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};