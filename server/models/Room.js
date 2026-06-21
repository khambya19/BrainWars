const mongoose = require('mongoose')

const playerSlotSchema = new mongoose.Schema(
  {
    playerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    name:      { type: String, required: true },
    socketId:  { type: String, required: true },
    score:     { type: Number, default: 0 },
    hp:        { type: Number, default: 100 },
    streak:    { type: Number, default: 0 },
    answered:  { type: Boolean, default: false },
  },
  { _id: false },
)

const roomSchema = new mongoose.Schema(
  {
    name:                 { type: String, default: 'Quiz Battle', trim: true },
    code:                 { type: String, required: true, unique: true, uppercase: true },
    host:                 { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    questionBank:         { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', default: null },
    isPublic:             { type: Boolean, default: false },
    players:              [playerSlotSchema],
    questions:            [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    currentQuestionIndex: { type: Number, default: -1 },
    status:               { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
    settings: {
      categories:       { type: [String], default: [] },
      difficulty:       { type: String, default: 'Mixed' },
      questionCount:    { type: Number, default: 10 },
      timePerQuestion:  { type: Number, default: 10 },
    },
  },
  { timestamps: true },
)

roomSchema.index({ status: 1, isPublic: 1 })

module.exports = mongoose.model('Room', roomSchema)
