const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {sendVerificationEmail} = require('../utils/SendEmail')
const path = require('path')
const APIResponse = require('../utils/APIResponse')
const fs = require('fs')
const JWT_SECRET = process.env.JWT_SECRET 


exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const certificatePath = req.file?.path || '';
  const isCertificateVerified = certificatePath ? true : false;

  if (role === 'Expert' && !isCertificateVerified) {
      return res.status(400).json(new APIResponse(null, 'Certificate is required for expert role').toJson());
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          // Delete the file if it was uploaded but user already exists
          if (certificatePath) {
              fs.unlinkSync(certificatePath);
          }
          return res.status(400).json(new APIResponse(null, 'User already exists').toJson());
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          isVerified: false,
          role,
          isCertificateVerified,
          certificate: isCertificateVerified ? certificatePath : undefined  // Save the file path if certificate is verified
      });

      const verificationToken = newUser.generateVerificationToken();
      await newUser.save();

      await sendVerificationEmail(newUser, verificationToken);

      res.status(201).json(new APIResponse(null, 'User registered successfully. Please check your email to verify your account.').toJson());
  } catch (error) {
      console.error('Signup error:', error);

      if (certificatePath) {
          fs.unlinkSync(certificatePath);
      }

      res.status(500).json(new APIResponse(null, error.message).toJson());
  }
};
  

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json(new APIResponse(null, 'Invalid username or password').toJson());

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(402).json(new APIResponse(null, 'Invalid username or password').toJson());

      if (!user.isVerified) return res.status(403).json(new APIResponse(null, 'Please verify your email before logging in').toJson());
      
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' } 
      );
  
      res.status(200).json(new APIResponse(token, 'Login successful').toJson());
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(new APIResponse(null, 'Internal server error').toJson());
    }
  };

  exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
  
    try {
      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() }
      });
  
      if (!user) return res.status(400).json(new APIResponse(null, 'Invalid or expired token').toJson());
  
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
  
      res.status(200).sendFile(path.join(__dirname, '../views/verificationSuccess.html'));
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).sendFile(path.join(__dirname, '../views/verificationError.html'));
  }
  };
  

  exports.verifyToken = (req, res) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) return res.status(401).json(new APIResponse(null, 'No authorization header provided').toJson());
        
        const token = authHeader.split(' ')[1]; // Extract token part from "Bearer <token>"
        if (!token) return res.status(401).json(new APIResponse(null, 'No token provided').toJson());

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json(new APIResponse(null, 'Invalid token').toJson());
            console.log(decoded);
            
            res.status(200).json(new APIResponse(decoded, 'Token verified successfully').toJson());
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json(new APIResponse(null, 'Internal server error').toJson());
    }
};

exports.fcmToken = async (req, res) => {
  try {
    const fcmToken = req.query.token;
    console.log(req.query);
    
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json(new APIResponse(null,"No User Found"));
    }
    console.log(user);
    
    user.fcmtoken = fcmToken;
    await user.save();
    
    res.status(200).json(new APIResponse(null,"FCM Token Updated Sucessfully"));
  } catch (error) {
    console.error('Error updating FCM token:', error);
    res.status(500).json(new APIResponse(null,"Server Error"));
  }
};
