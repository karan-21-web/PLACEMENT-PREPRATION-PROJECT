import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    // Industry standard RFC 5322 regex for strict email validation
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'] // Increased min length to 8
  },
  profile: {
    college: {
      type: String,
      default: '',
      trim: true
    },
    branch: {
      type: String,
      default: '',
      trim: true
    },
    targetRoles: {
      type: [String],
      default: []
    },
    targetSalary: {
      type: Number,
      default: 0
    },
    graduationYear: {
      type: Number,
      default: new Date().getFullYear() + 1
    },
    preparationStatus: {
      type: String,
      enum: ['Just Starting', 'Intermediate', 'Ready'],
      default: 'Just Starting'
    }
  }
}, {
  timestamps: true
});

// Middleware to hash password prior to saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method helper to compare plain password to hashed equivalent
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
