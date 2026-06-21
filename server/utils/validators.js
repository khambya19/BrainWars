const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email).trim())
}

module.exports = { EMAIL_REGEX, isValidEmail }
