function buildPlayerPayload(player) {
  return { id: player._id, name: player.name, email: player.email }
}

module.exports = { buildPlayerPayload }
