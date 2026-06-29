import { AlertCircle, Globe, Lock, RefreshCw, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../api/client.js'
import { useBanks } from '../../hooks/useBanks.js'
import { useGameSocketContext } from '../../context/GameSocketContext.jsx'

// This page handles the dashboard play and room flow.

const CATEGORIES = [
  'Mathematics', 'English', 'General Knowledge', 'Programming',
  'Science', 'History', 'Geography', 'Technology', 'Sports', 'Entertainment',
]
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Mixed']

const TABS = ['Create Room', 'Join Room', 'Public Rooms']

export default function PlayPage() {
  const navigate  = useNavigate()
  const { game, createRoom, joinRoom } = useGameSocketContext()

  const [tab, setTab]               = useState(0)
  const { banks } = useBanks()
  const [publicRooms, setPublicRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(false)

  const [form, setForm] = useState({
    name:            '',
    questionBank:    '',
    categories:      [],
    difficulty:      'Mixed',
    questionCount:   10,
    timePerQuestion: 10,
    isPublic:        false,
  })

  const [joinCode, setJoinCode]         = useState('')
  const [joinError, setJoinError]       = useState('')
  const [creating, setCreating]         = useState(false)
  const [joining, setJoining]           = useState(false)
  const [createError, setCreateError]   = useState('')
  const [publicRoomsError, setPublicRoomsError] = useState(null)

  useEffect(() => {
    if (tab === 2) fetchPublicRooms()
  }, [tab])

  useEffect(() => {
    if (game.state === 'lobby' || game.state === 'starting' || game.state === 'question') {
      navigate('/game')
    }
  }, [game.state, navigate])

  async function fetchPublicRooms() {
    setLoadingRooms(true)
    setPublicRoomsError(null)
    try {
      const r    = await apiFetch('/api/rooms/public')
      const data = await r.json()
      setPublicRooms(data)
    } catch (err) {
      console.error('[BrainWars/PlayPage] Failed to fetch public rooms:', err)
      setPublicRoomsError('Could not load public rooms.')
    } finally {
      setLoadingRooms(false)
    }
  }

  function toggleCategory(cat) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }))
  }

  function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) { setCreateError('Room name is required.'); return }
    setCreating(true)
    setCreateError('')
    createRoom({
      name:            form.name.trim(),
      questionBank:    form.questionBank || null,
      categories:      form.categories,
      difficulty:      form.difficulty,
      questionCount:   form.questionCount,
      timePerQuestion: form.timePerQuestion,
      isPublic:        form.isPublic,
    })
  }

  useEffect(() => {
    if (game.error) setCreating(false)
  }, [game.error])

  function handleJoin(e) {
    e?.preventDefault()
    const code = joinCode.trim().toUpperCase()
    if (code.length !== 4) { setJoinError('Enter a 4-character code.'); return }
    setJoining(true)
    setJoinError('')
    joinRoom(code, (errMsg) => {
      setJoinError(errMsg)
      setJoining(false)
    })
  }

  function handleCodeChange(e) {
    const val = e.target.value.toUpperCase()
    setJoinCode(val)
    setJoinError('')
    if (val.length === 4) {
      setJoining(true)
      joinRoom(val, (errMsg) => {
        setJoinError(errMsg)
        setJoining(false)
      })
    }
  }

  return (
    <div>
      <div className="animate-fade-in-up mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Game</p>
        <h1 className="font-orbitron text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-text">
          Play
        </h1>
      </div>

      <div className="animate-fade-in-up mb-6 flex gap-1 rounded-full border border-pink-500/14 bg-panel/60 p-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition duration-150 ${
              tab === i
                ? 'border border-pink-500/18 bg-pink-500/12 text-text'
                : 'text-slate-400 hover:text-text'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <form onSubmit={handleCreate} className="animate-fade-in grid gap-5">
          {createError && <p className="text-sm text-danger">{createError}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Room Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="JavaScript Battle"
                className="min-h-11 w-full rounded-xl border border-pink-500/20 bg-panel/85 px-4 text-sm text-text outline-none focus:border-pink-500/50 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Question Bank</label>
              <select
                value={form.questionBank}
                onChange={(e) => setForm((f) => ({ ...f, questionBank: e.target.value }))}
                className="min-h-11 w-full rounded-xl border border-pink-500/20 bg-panel/85 px-4 text-sm text-text outline-none focus:border-pink-500/50"
              >
                <option value="">Global pool (all questions)</option>
                {banks.map((b) => (
                  <option key={b._id} value={b._id}>{b.name} ({b.questionCount}q)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                    className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition ${
                      form.difficulty === d
                        ? 'border-pink-500/40 bg-pink-500/15 text-text'
                        : 'border-pink-500/12 text-slate-400 hover:text-text'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                Questions — {form.questionCount}
              </label>
              <input
                type="range"
                min="5" max="50" step="5"
                value={form.questionCount}
                onChange={(e) => setForm((f) => ({ ...f, questionCount: Number(e.target.value) }))}
                className="w-full accent-pink-500"
              />
              <div className="mt-1 flex justify-between text-[0.65rem] text-slate-500">
                <span>5</span><span>50</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                Time / Question — {form.timePerQuestion}s
              </label>
              <input
                type="range"
                min="5" max="30" step="5"
                value={form.timePerQuestion}
                onChange={(e) => setForm((f) => ({ ...f, timePerQuestion: Number(e.target.value) }))}
                className="w-full accent-pink-500"
              />
              <div className="mt-1 flex justify-between text-[0.65rem] text-slate-500">
                <span>5s</span><span>30s</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
              Categories {form.categories.length > 0 ? `(${form.categories.length} selected)` : '(all)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    form.categories.includes(cat)
                      ? 'border-pink-500/40 bg-pink-500/15 text-text'
                      : 'border-pink-500/12 text-slate-400 hover:text-text'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))}
              className={`relative inline-flex h-6 w-11 rounded-full border transition duration-200 ${
                form.isPublic ? 'border-pink-500/40 bg-pink-500/30' : 'border-white/10 bg-white/8'
              }`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-text shadow transition-all duration-200 ${form.isPublic ? 'left-5' : 'left-0.5'}`} />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              {form.isPublic ? <Globe size={14} className="text-lime-400" /> : <Lock size={14} />}
              {form.isPublic ? 'Public room — anyone can join' : 'Private room — code only'}
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="min-h-12 rounded-2xl border border-pink-500/40 bg-pink-500 font-bold text-white transition hover:-translate-y-0.5 hover:bg-pink-400 disabled:cursor-wait disabled:opacity-60"
          >
            {creating ? 'Creating room…' : 'Create room'}
          </button>
        </form>
      )}

      {tab === 1 && (
        <form onSubmit={handleJoin} className="animate-fade-in mx-auto max-w-sm">
          <label className="mb-2 block text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            Room Code
          </label>
          <input
            value={joinCode}
            onChange={handleCodeChange}
            maxLength={4}
            placeholder="AB12"
            autoFocus
            disabled={joining}
            className="min-h-16 w-full rounded-2xl border border-pink-500/20 bg-panel/85 px-4 text-center font-data text-3xl uppercase tracking-[0.3em] text-text outline-none focus:border-pink-500/50 placeholder:text-slate-600 disabled:opacity-60"
          />
          {joinError && <p className="mt-2 text-center text-xs text-danger">{joinError}</p>}
          <button
            type="submit"
            disabled={joining}
            className="mt-4 min-h-12 w-full rounded-2xl border border-pink-500/40 bg-pink-500 font-bold text-white transition hover:-translate-y-0.5 hover:bg-pink-400 disabled:opacity-60"
          >
            {joining ? 'Joining…' : 'Join room'}
          </button>
        </form>
      )}

      {tab === 2 && (
        <div className="animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-400">{publicRooms.length} public room{publicRooms.length !== 1 ? 's' : ''} available</p>
            <button type="button" onClick={fetchPublicRooms} className="text-slate-400 transition hover:text-pink-400">
              <RefreshCw size={15} />
            </button>
          </div>

          {loadingRooms ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : publicRoomsError ? (
            <div className="flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-5">
              <AlertCircle size={18} className="shrink-0 text-danger" />
              <div>
                <p className="text-sm font-medium text-danger">{publicRoomsError}</p>
                <button
                  type="button"
                  onClick={fetchPublicRooms}
                  className="mt-1 text-xs text-slate-400 underline underline-offset-2 transition hover:text-pink-400"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : publicRooms.length === 0 ? (
            <div className="rounded-2xl border border-pink-500/15 bg-panel/85 p-10 text-center">
              <Globe size={28} className="mx-auto mb-3 text-slate-600" />
              <p className="text-sm text-slate-400">No public rooms right now.</p>
              <p className="mt-1 text-xs text-slate-600">Create one and set it to public!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {publicRooms.map((room) => (
                <div key={room.code} className="flex items-center gap-4 rounded-2xl border border-pink-500/15 bg-panel/85 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text">{room.name}</p>
                    <p className="text-xs text-slate-400">
                      by {room.host} · {room.settings?.difficulty} · {room.settings?.questionCount}q · {room.settings?.timePerQuestion}s
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Users size={12} />
                    {room.playerCount}
                  </div>
                  <div className="font-data text-sm tracking-widest text-slate-300">{room.code}</div>
                  <button
                    type="button"
                    onClick={() => { setJoinCode(room.code); setTab(1) }}
                    className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-text transition hover:bg-pink-500/20"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
