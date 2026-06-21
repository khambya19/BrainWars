const mongoose = require('mongoose')

const questionBankSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    description:   { type: String, default: '', trim: true },
    host:          { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    questionCount: { type: Number, default: 0 },
    categories:    { type: [String], default: [] },
    isPublic:      { type: Boolean, default: false },
  },
  { timestamps: true },
)

questionBankSchema.index({ host: 1 })

module.exports = mongoose.model('QuestionBank', questionBankSchema)
