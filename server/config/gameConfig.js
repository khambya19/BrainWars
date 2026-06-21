module.exports = {
  ROOM_CODE: {
    LENGTH: 4,
    CHARS:  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  },
  DEFAULTS: {
    QUESTION_COUNT:    10,
    TIME_PER_QUESTION: 10,
    DIFFICULTY:        'Mixed',
    HP:                100,
  },
  SCORING: {
    HP_WRONG:     -20,
    HP_NO_ANSWER: -15,
    HP_FAST:       +5,
    MIN_SPEED_RATIO: 0.5,
  },
}
