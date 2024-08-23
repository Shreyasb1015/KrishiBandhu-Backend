const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'expert'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  iscertificateVerified:{
    type: Boolean,
    default: false

  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatarUrl: String,
    contactEmail: String
  },
  fcmtoken:{
    type: String,
    default:''
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  verificationToken: String, 
  verificationTokenExpires: Date 
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  this.verificationTokenExpires = Date.now() +  2592000000; 
  return token;
};

module.exports = mongoose.model('User', userSchema);