const express = require('express')
const XLSX    = require('xlsx')

const authenticate  = require('../middleware/authenticate')
const upload        = require('../middleware/upload')
const Question      = require('../models/Question')
const QuestionBank  = require('../models/QuestionBank')

const router = express.Router()

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']

// Map common aliases to standard category names
const CATEGORY_MAP = {
  'math':              'Mathematics',
  'maths':             'Mathematics',
  'mathematics':       'Mathematics',
  'english':           'English',
  'general knowledge': 'General Knowledge',
  'general':           'General Knowledge',
  'gk':                'General Knowledge',
  'programming':       'Programming',
  'science':           'Science',
  'history':           'History',
  'geography':         'Geography',
  'geo':               'Geography',
  'technology':        'Technology',
  'tech':              'Technology',
  'sports':            'Sports',
  'entertainment':     'Entertainment',
}

function normalizeCategory(raw) {
  if (!raw) return null
  const key = String(raw).trim().toLowerCase()
  return CATEGORY_MAP[key] ?? String(raw).trim()
}

function normalizeDifficulty(raw) {
  if (!raw) return null
  const key = String(raw).trim().toLowerCase()
  return VALID_DIFFICULTIES.includes(key)
    ? key.charAt(0).toUpperCase() + key.slice(1)
    : null
}

function getField(row, ...keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
      return String(row[key]).trim()
    }
  }
  return ''
}

function validateAndBuildQuestion(row, i) {
  const text         = getField(row, 'Question', 'question')
  const rawType      = getField(row, 'Question Type', 'question_type', 'type', 'questionType')
  const rawOptA      = getField(row, 'Option A', 'optionA', 'option_a', 'OptionA')
  const rawOptB      = getField(row, 'Option B', 'optionB', 'option_b', 'OptionB')
  const rawOptC      = getField(row, 'Option C', 'optionC', 'option_c', 'OptionC')
  const rawOptD      = getField(row, 'Option D', 'optionD', 'option_d', 'OptionD')
  const rawAnswer    = getField(row, 'Correct Answer', 'correctAnswer', 'correct_answer', 'answer', 'Answer')
  const rawCategory  = getField(row, 'Category', 'category')
  const rawDiff      = getField(row, 'Difficulty', 'difficulty')

  const rowNum = i + 2

  if (!text)      throw new Error(`Row ${rowNum}: question text is missing`)
  if (!rawAnswer) throw new Error(`Row ${rowNum}: correct answer is missing`)
  if (!rawCategory) throw new Error(`Row ${rowNum}: category is missing`)
  if (!rawDiff)   throw new Error(`Row ${rowNum}: difficulty is missing`)

  const diff = normalizeDifficulty(rawDiff)
  if (!diff) throw new Error(`Row ${rowNum}: difficulty "${rawDiff}" must be Easy, Medium, or Hard`)

  const category = normalizeCategory(rawCategory)

  // Determine question type
  const typeKey = rawType.toLowerCase().replace(/[\s\-_\/]/g, '')
  const isTrueFalse = typeKey === 'truefalse' || typeKey === 'tf' || typeKey === 'boolean' || typeKey === 'trueorfalse'
  const type = isTrueFalse ? 'true-false' : 'mcq'

  let options
  let correctAnswer

  if (type === 'true-false') {
    options = ['True', 'False']
    const answerLower = rawAnswer.toLowerCase()
    if (answerLower === 'true')  correctAnswer = 'True'
    else if (answerLower === 'false') correctAnswer = 'False'
    else throw new Error(`Row ${rowNum}: True/False answer must be "True" or "False" (got "${rawAnswer}")`)
  } else {
    if (!rawOptA) throw new Error(`Row ${rowNum}: Option A is missing`)
    if (!rawOptB) throw new Error(`Row ${rowNum}: Option B is missing`)
    if (!rawOptC) throw new Error(`Row ${rowNum}: Option C is missing`)
    if (!rawOptD) throw new Error(`Row ${rowNum}: Option D is missing`)

    options = [rawOptA, rawOptB, rawOptC, rawOptD]

    // Support two correct answer formats:
    // Format 1: A/B/C/D  →  map to option text
    // Format 2: Actual answer text  →  verify it matches one option
    const upperAnswer = rawAnswer.toUpperCase()
    const abcdMap     = { A: 0, B: 1, C: 2, D: 3 }

    if (abcdMap[upperAnswer] !== undefined) {
      correctAnswer = options[abcdMap[upperAnswer]]
    } else {
      const matched = options.find(
        (opt) => opt.toLowerCase() === rawAnswer.toLowerCase()
      )
      if (!matched) {
        throw new Error(
          `Row ${rowNum}: correct answer "${rawAnswer}" does not match any option (${options.join(', ')})`
        )
      }
      correctAnswer = matched
    }
  }

  return {
    text,
    type,
    options,
    correctAnswer,
    category,
    difficulty: diff,
    points:     diff === 'Hard' ? 300 : diff === 'Medium' ? 200 : 100,
    timeLimit:  diff === 'Hard' ? 20  : diff === 'Medium' ? 15  : 10,
  }
}

function parseFile(buffer, filename) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet    = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

router.get('/', authenticate, async (req, res) => {
  try {
    const banks = await QuestionBank.find({ host: req.playerId }).sort({ createdAt: -1 })
    res.json(banks)
  } catch {
    res.status(500).json({ message: 'Could not fetch question banks.' })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Bank name is required.' })

    const bank = await QuestionBank.create({
      name:        name.trim(),
      description: description?.trim() ?? '',
      host:        req.playerId,
      isPublic:    Boolean(isPublic),
    })
    res.status(201).json(bank)
  } catch {
    res.status(500).json({ message: 'Could not create question bank.' })
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const bank = await QuestionBank.findOne({ _id: req.params.id, host: req.playerId })
    if (!bank) return res.status(404).json({ message: 'Bank not found.' })

    const questions = await Question.find({ bank: bank._id }).sort({ createdAt: -1 })
    res.json({ bank, questions })
  } catch {
    res.status(500).json({ message: 'Could not fetch bank.' })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const bank = await QuestionBank.findOneAndDelete({ _id: req.params.id, host: req.playerId })
    if (!bank) return res.status(404).json({ message: 'Bank not found.' })

    await Question.deleteMany({ bank: bank._id })
    res.json({ message: 'Bank and all its questions deleted.' })
  } catch {
    res.status(500).json({ message: 'Could not delete bank.' })
  }
})

router.delete('/:id/questions/:qid', authenticate, async (req, res) => {
  try {
    const bank = await QuestionBank.findOne({ _id: req.params.id, host: req.playerId })
    if (!bank) return res.status(404).json({ message: 'Bank not found.' })

    await Question.findByIdAndDelete(req.params.qid)
    await QuestionBank.findByIdAndUpdate(bank._id, { $inc: { questionCount: -1 } })
    res.json({ message: 'Question deleted.' })
  } catch {
    res.status(500).json({ message: 'Could not delete question.' })
  }
})

router.post('/:id/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const bank = await QuestionBank.findOne({ _id: req.params.id, host: req.playerId })
    if (!bank)     return res.status(404).json({ message: 'Bank not found.' })
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })

    const rows = parseFile(req.file.buffer, req.file.originalname)
    if (rows.length === 0) return res.status(400).json({ message: 'File is empty or has no data rows.' })

    const errors = []
    const valid  = []

    rows.forEach((row, i) => {
      try {
        valid.push(validateAndBuildQuestion(row, i))
      } catch (err) {
        errors.push(err.message)
      }
    })

    if (errors.length > 0) {
      return res.status(422).json({
        message: `Found ${errors.length} error(s). Fix them and re-upload.`,
        errors:  errors.slice(0, 20),
        total:   errors.length,
      })
    }

    const docs = valid.map((q) => ({ ...q, bank: bank._id, host: req.playerId }))

    // Insert in batches to avoid timeout on large files
    const BATCH = 200
    for (let i = 0; i < docs.length; i += BATCH) {
      await Question.insertMany(docs.slice(i, i + BATCH))
    }

    const categories = [...new Set(valid.map((q) => q.category))]
    await QuestionBank.findByIdAndUpdate(bank._id, {
      $inc:      { questionCount: valid.length },
      $addToSet: { categories: { $each: categories } },
    })

    res.status(201).json({
      message: `${valid.length} questions uploaded successfully.`,
      count:   valid.length,
    })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed.' })
  }
})

module.exports = router
