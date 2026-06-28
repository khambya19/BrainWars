const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name must be 60 characters or less'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    stats: {
      gamesPlayed: { type: Number, default: 0 },
      bestStreak:  { type: Number, default: 0 },
      totalScore:  { type: Number, default: 0 },
    },
    trophies: {
      type:    Number,
      default: 0,
      min:     0,
    },
    customTitle:         { type: String, maxlength: 24, default: null, trim: true },
    resetToken:          { type: String, select: false },
    resetTokenExpiry:    { type: Date,   select: false },
    lastDailyBonusDate:  { type: Date,   default: null },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Player', playerSchema)
