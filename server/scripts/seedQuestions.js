require('dotenv').config()

const mongoose = require('mongoose')
const Question = require('../models/Question')
const questions = require('../data/questions')

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    const existing = await Question.countDocuments()
    if (existing > 0) {
      console.log(`${existing} questions already in DB. Clearing and re-seeding...`)
      await Question.deleteMany({})
    }

    const inserted = await Question.insertMany(questions)
    console.log(`Seeded ${inserted.length} questions successfully.`)

    const byCategory = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    console.log('\nBreakdown by category:')
    byCategory.forEach(({ _id, count }) => console.log(`  ${_id}: ${count}`))
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\nDone.')
  }
}

seed()
