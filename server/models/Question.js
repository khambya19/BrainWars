const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
  {
    text:          { type: String, required: true, trim: true },
    type:          { type: String, enum: ['mcq', 'true-false'], default: 'mcq' },
    options:       { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    category:      { type: String, required: true },
    difficulty:    { type: String, enum: ['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard'], default: 'Medium' },
    points:        { type: Number, default: 100 },
    timeLimit:     { type: Number, default: 15, min: 5, max: 60 },
    bank:          { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', default: null },
    host:          { type: mongoose.Schema.Types.ObjectId, ref: 'Player',       default: null },
  },
  { timestamps: true },
)

questionSchema.index({ bank: 1, category: 1, difficulty: 1 })
questionSchema.index({ host: 1 })

module.exports = mongoose.model('Question', questionSchema)
