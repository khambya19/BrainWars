const jwt = require('jsonwebtoken')

function authenticate(request, response, next) {
  const authorization = request.headers.authorization || ''

  if (!authorization.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required.' })
  }

  const token = authorization.slice(7).trim()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    request.playerId = decoded.playerId
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ message: 'Session expired. Please log in again.' })
    }
    return response.status(401).json({ message: 'Invalid token.' })
  }
}

module.exports = authenticate
