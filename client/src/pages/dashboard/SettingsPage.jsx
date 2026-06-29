import { AlertTriangle, CheckCircle, Key, Tag, User, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiFetch } from '../../api/client.js'

// This page renders the user settings view.

function getPasswordStrength(pw) {
  if (!pw) return null
  let score = 0
  if (pw.length >= 8)           score++
  if (pw.length >= 12)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return 'weak'
  if (score <= 3) return 'fair'
  if (score <= 4) return 'good'
  return 'strong'
}

const STRENGTH_CONFIG = {
  weak:   { bars: 1, color: 'bg-danger', label: 'Too weak',  text: 'text-danger' },
  fair:   { bars: 2, color: 'bg-amber-400',  label: 'Fair',      text: 'text-amber-400'  },
  good:   { bars: 3, color: 'bg-yellow-300', label: 'Good',      text: 'text-yellow-300' },
  strong: { bars: 4, color: 'bg-lime-400',   label: 'Strong',    text: 'text-lime-400'   },
}

function validatePasswordRules(pw) {
  if (!pw || pw.length < 8)    return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(pw))       return 'Password must contain at least one uppercase letter.'
  if (!/[0-9]/.test(pw))       return 'Password must contain at least one number.'
  return null
}

function SettingBlock({ title, description, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-pink-500/15 bg-panel/85 p-6">
      <div className="mb-1 flex items-center gap-2 text-text">
        {Icon && <Icon size={15} className="text-pink-400" aria-hidden="true" />}
        <h2 className="font-orbitron text-[0.9rem] tracking-[-0.03em]">{title}</h2>
      </div>
      {description && <p className="mb-4 text-sm text-slate-400">{description}</p>}
      {children}
    </div>
  )
}

function StatusMessage({ status }) {
  if (!status) return null
  return (
    <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
      status.ok
        ? 'border border-lime-400/20 bg-lime-400/8 text-lime-400'
        : 'border border-danger/20 bg-danger/8 text-danger'
    }`}>
      {status.ok
        ? <CheckCircle size={14} aria-hidden="true" />
        : <XCircle size={14} aria-hidden="true" />
      }
      {status.message}
    </div>
  )
}

export default function SettingsPage() {
  const { player, login, logout, refreshPlayer } = useAuth()
  const navigate = useNavigate()

  // Display name
  const [nameValue, setNameValue]       = useState(player?.name ?? '')

  // Custom title
  const MAX_TITLE = 24
  const [titleValue, setTitleValue]   = useState(player?.customTitle ?? '')
  const [titleSaving, setTitleSaving] = useState(false)
  const [titleStatus, setTitleStatus] = useState(null)
  const [nameSaving, setNameSaving]     = useState(false)
  const [nameStatus, setNameStatus]     = useState(null)

  // Change password
  const [pwForm, setPwForm]         = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving]     = useState(false)
  const [pwStatus, setPwStatus]     = useState(null)

  // Delete account
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirm, setDeleteConfirm]   = useState(false)
  const [deleteStatus, setDeleteStatus]     = useState(null)
  const [deleting, setDeleting]             = useState(false)

  async function handleNameSave(e) {
    e.preventDefault()
    setNameSaving(true)
    setNameStatus(null)
    try {
      const res = await apiFetch('/api/auth/name', {
        method: 'PATCH',
        body: JSON.stringify({ name: nameValue }),
      })
      const data = await res.json()
      if (!res.ok) {
        setNameStatus({ ok: false, message: data.message })
      } else {
        setNameStatus({ ok: true, message: 'Name updated.' })
        await refreshPlayer()
      }
    } catch (err) {
      console.error('[BrainWars/Settings] Name update failed:', err)
      setNameStatus({ ok: false, message: 'Request failed. Try again.' })
    } finally {
      setNameSaving(false)
    }
  }

  async function handleTitleSave(e) {
    e.preventDefault()
    setTitleSaving(true)
    setTitleStatus(null)
    try {
      const res = await apiFetch('/api/auth/title', {
        method: 'PATCH',
        body: JSON.stringify({ customTitle: titleValue.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setTitleStatus({ ok: false, message: data.message })
      } else {
        setTitleStatus({ ok: true, message: titleValue.trim() ? 'Title updated.' : 'Title cleared.' })
        await refreshPlayer()
      }
    } catch (err) {
      console.error('[BrainWars/Settings] Title update failed:', err)
      setTitleStatus({ ok: false, message: 'Request failed. Try again.' })
    } finally {
      setTitleSaving(false)
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPwStatus(null)
    const ruleError = validatePasswordRules(pwForm.next)
    if (ruleError) {
      setPwStatus({ ok: false, message: ruleError })
      return
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwStatus({ ok: false, message: 'New passwords do not match.' })
      return
    }
    setPwSaving(true)
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwStatus({ ok: false, message: data.message })
      } else {
        setPwStatus({ ok: true, message: 'Password changed successfully.' })
        setPwForm({ current: '', next: '', confirm: '' })
      }
    } catch (err) {
      console.error('[BrainWars/Settings] Password change failed:', err)
      setPwStatus({ ok: false, message: 'Request failed. Try again.' })
    } finally {
      setPwSaving(false)
    }
  }

  async function handleDeleteAccount(e) {
    e.preventDefault()
    if (!deleteConfirm) {
      setDeleteStatus({ ok: false, message: 'Check the confirmation checkbox first.' })
      return
    }
    setDeleting(true)
    setDeleteStatus(null)
    try {
      const res = await apiFetch('/api/auth/me', {
        method: 'DELETE',
        body: JSON.stringify({ password: deletePassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDeleteStatus({ ok: false, message: data.message })
      } else {
        logout()
        navigate('/')
      }
    } catch (err) {
      console.error('[BrainWars/Settings] Account deletion failed:', err)
      setDeleteStatus({ ok: false, message: 'Request failed. Try again.' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="animate-fade-in-up mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Preferences</p>
        <h1 className="font-orbitron text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-text">
          Settings
        </h1>
      </div>

      <div className="grid gap-4">

        {/* Display name */}
        <div className="animate-fade-in-up delay-60">
          <SettingBlock icon={User} title="Display name" description="Change how your name appears on leaderboards and in game rooms.">
            <form onSubmit={handleNameSave} className="flex gap-2">
              <input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                minLength={2}
                maxLength={60}
                required
                placeholder="Your display name"
                className="min-h-11 flex-1 rounded-xl border border-pink-500/20 bg-void/60 px-4 text-sm text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50"
              />
              <button
                type="submit"
                disabled={nameSaving}
                className="min-h-11 rounded-xl border border-pink-500/40 bg-pink-500 px-5 text-sm font-bold text-white transition hover:bg-pink-400 disabled:opacity-50"
              >
                {nameSaving ? 'Saving…' : 'Save'}
              </button>
            </form>
            <StatusMessage status={nameStatus} />
          </SettingBlock>
        </div>

        {/* Change password */}
        {/* Custom title */}
        <div className="animate-fade-in-up delay-100">
          <SettingBlock icon={Tag} title="Custom title" description="A short tag displayed under your name on leaderboards and your profile. Leave blank to clear it.">
            <form onSubmit={handleTitleSave} className="grid gap-2">
              <div className="relative">
                <input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value.slice(0, MAX_TITLE))}
                  placeholder="No title set"
                  maxLength={MAX_TITLE}
                  className="min-h-11 w-full rounded-xl border border-pink-500/20 bg-void/60 px-4 pr-14 text-sm text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-data text-xs text-slate-500">
                  {titleValue.length}/{MAX_TITLE}
                </span>
              </div>
              <button
                type="submit"
                disabled={titleSaving}
                className="min-h-10 rounded-xl border border-pink-500/40 bg-pink-500 text-sm font-bold text-white transition hover:bg-pink-400 disabled:opacity-50"
              >
                {titleSaving ? 'Saving…' : 'Save title'}
              </button>
            </form>
            <StatusMessage status={titleStatus} />
          </SettingBlock>
        </div>

        <div className="animate-fade-in-up delay-120">
          <SettingBlock icon={Key} title="Change password" description="Update your login credentials. You'll need your current password.">
            <form onSubmit={handlePasswordChange} className="grid gap-2">
              <input
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                placeholder="Current password"
                required
                className="min-h-11 rounded-xl border border-pink-500/20 bg-void/60 px-4 text-sm text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50"
              />
              <div className="grid gap-1.5">
                <input
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                  placeholder="New password (8+ chars, 1 uppercase, 1 number)"
                  required
                  className="min-h-11 rounded-xl border border-pink-500/20 bg-void/60 px-4 text-sm text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50"
                />
                {(() => {
                  const s = getPasswordStrength(pwForm.next)
                  const cfg = s ? STRENGTH_CONFIG[s] : null
                  if (!cfg) return null
                  return (
                    <div className="grid gap-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div key={bar} className={`h-1 flex-1 rounded-full transition-all duration-300 ${bar <= cfg.bars ? cfg.color : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <p className={`text-xs ${cfg.text}`}>{cfg.label}</p>
                    </div>
                  )
                })()}
              </div>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                placeholder="Confirm new password"
                required
                className="min-h-11 rounded-xl border border-pink-500/20 bg-void/60 px-4 text-sm text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50"
              />
              <button
                type="submit"
                disabled={pwSaving}
                className="min-h-11 rounded-xl border border-pink-500/40 bg-pink-500 text-sm font-bold text-white transition hover:bg-pink-400 disabled:opacity-50"
              >
                {pwSaving ? 'Updating…' : 'Update password'}
              </button>
            </form>
            <StatusMessage status={pwStatus} />
          </SettingBlock>
        </div>

        {/* Danger zone */}
        <div className="animate-fade-in-up delay-180">
          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6">
            <div className="mb-1 flex items-center gap-2 text-danger">
              <AlertTriangle size={15} aria-hidden="true" />
              <h2 className="font-orbitron text-[0.9rem] tracking-[-0.03em]">Danger zone</h2>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              Permanently delete your account and all associated data. This cannot be undone.
              Your match history will be anonymised — other players' records are preserved.
            </p>
            <form onSubmit={handleDeleteAccount} className="grid gap-3">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password to confirm"
                required
                className="min-h-11 rounded-xl border border-danger/20 bg-void/60 px-4 text-sm text-text placeholder:text-slate-600 outline-none focus:border-danger/50"
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.checked)}
                  className="accent-danger"
                />
                I understand this action is permanent and cannot be undone.
              </label>
              <button
                type="submit"
                disabled={deleting || !deleteConfirm}
                className="min-h-10 rounded-xl border border-danger/30 bg-danger/10 text-sm font-bold text-danger transition hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? 'Deleting…' : 'Delete my account'}
              </button>
            </form>
            <StatusMessage status={deleteStatus} />
          </div>
        </div>

      </div>
    </div>
  )
}
