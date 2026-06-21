import { BookOpen, Plus, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { apiFetch } from '../../api/client.js'
import { useBanks } from '../../hooks/useBanks.js'
import { parseResponse } from '../../utils/api.js'
import { getToken } from '../../utils/auth.js'

export default function BanksPage() {
  const { banks, setBanks, loading, refresh: fetchBanks } = useBanks()
  const [creating, setCreating]     = useState(false)
  const [newName, setNewName]       = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [error, setError]           = useState('')
  const [uploadingId, setUploadingId] = useState(null)
  const [uploadMsg, setUploadMsg]   = useState({})
  const fileRef                     = useRef(null)
  const activeUploadBank            = useRef(null)


  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      const r = await apiFetch('/api/banks', { method: 'POST', body: JSON.stringify({ name: newName.trim() }) })
      const bank = await parseResponse(r, 'Could not create bank.')
      setBanks((prev) => [bank, ...prev])
      setNewName('')
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this bank and all its questions?')) return
    try {
      await apiFetch(`/api/banks/${id}`, { method: 'DELETE' })
      setBanks((prev) => prev.filter((b) => b._id !== id))
    } catch { }
  }

  function triggerUpload(bankId) {
    activeUploadBank.current = bankId
    fileRef.current?.click()
  }

  async function handleFileChange(e) {
    const file   = e.target.files?.[0]
    const bankId = activeUploadBank.current
    if (!file || !bankId) return
    e.target.value = ''

    setUploadingId(bankId)
    setUploadMsg((m) => ({ ...m, [bankId]: null }))

    const formData = new FormData()
    formData.append('file', file)

    try {
      const r = await fetch(`/api/banks/${bankId}/upload`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body:    formData,
      })
      const data = await r.json()
      if (!r.ok) {
        const msg = data.errors ? `${data.errors[0]}${data.errors.length > 1 ? ` (+${data.errors.length - 1} more)` : ''}` : data.message
        setUploadMsg((m) => ({ ...m, [bankId]: { ok: false, msg } }))
      } else {
        setUploadMsg((m) => ({ ...m, [bankId]: { ok: true, msg: data.message } }))
        fetchBanks()
      }
    } catch {
      setUploadMsg((m) => ({ ...m, [bankId]: { ok: false, msg: 'Upload failed.' } }))
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div>
      <div className="animate-fade-in-up mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Host</p>
          <h1 className="font-['Orbitron'] text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
            Question Banks
          </h1>
          <p className="mt-2 text-sm text-slate-400">Upload CSV or Excel files to build your question banks.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 text-sm font-medium text-[#EDEFF5] transition hover:-translate-y-0.5 hover:bg-pink-500/20"
        >
          <Plus size={15} /> New bank
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="animate-fade-in-down mb-6 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Bank name e.g. Programming Quiz"
            className="min-h-11 flex-1 rounded-xl border border-pink-500/20 bg-[#141B2E]/85 px-4 text-sm text-[#EDEFF5] outline-none focus:border-pink-500/50 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="min-h-11 rounded-xl border border-pink-500/40 bg-pink-500 px-5 text-sm font-bold text-white transition hover:bg-pink-400 disabled:opacity-60"
          >
            {creating ? 'Creating…' : 'Create'}
          </button>
        </form>
      )}

      {error && <p className="mb-4 text-sm text-[#FF5A4E]">{error}</p>}

      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : banks.length === 0 ? (
        <div className="rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-10 text-center">
          <BookOpen size={28} className="mx-auto mb-3 text-slate-600" />
          <p className="text-sm text-slate-400">No question banks yet.</p>
          <p className="mt-1 text-xs text-slate-600">Create one and upload a CSV or Excel file.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {banks.map((bank) => (
            <div key={bank._id} className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-['Orbitron'] text-[0.95rem] tracking-[-0.03em] text-[#EDEFF5]">{bank.name}</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {bank.questionCount} question{bank.questionCount !== 1 ? 's' : ''}
                    {bank.categories?.length > 0 && ` · ${bank.categories.slice(0, 2).join(', ')}${bank.categories.length > 2 ? '…' : ''}`}
                  </p>
                </div>
                <button type="button" onClick={() => handleDelete(bank._id)} className="text-slate-600 transition hover:text-[#FF5A4E]">
                  <Trash2 size={15} />
                </button>
              </div>

              {uploadMsg[bank._id] && (
                <p className={`mb-3 text-xs ${uploadMsg[bank._id].ok ? 'text-lime-400' : 'text-[#FF5A4E]'}`}>
                  {uploadMsg[bank._id].msg}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => triggerUpload(bank._id)}
                  disabled={uploadingId === bank._id}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-pink-500/20 bg-pink-500/8 py-2 text-xs font-medium text-[#EDEFF5] transition hover:bg-pink-500/15 disabled:opacity-60"
                >
                  <Upload size={13} />
                  {uploadingId === bank._id ? 'Uploading…' : 'Upload CSV / Excel'}
                </button>
                <Link
                  to={`/dashboard/banks/${bank._id}`}
                  className="inline-flex items-center rounded-xl border border-pink-500/15 px-3 text-xs text-slate-400 transition hover:text-pink-400"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-pink-500/10 bg-[#141B2E]/40 p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">CSV / Excel format</p>
        <code className="block overflow-x-auto rounded-xl bg-[#0B0F1A] px-4 py-3 text-[0.7rem] text-slate-300">
          question,optionA,optionB,optionC,optionD,correctAnswer,category,difficulty{'\n'}
          What is 2+2?,3,4,5,6,B,Mathematics,Easy{'\n'}
          Capital of Nepal?,Pokhara,Kathmandu,Dharan,Butwal,B,General Knowledge,Easy
        </code>
        <p className="mt-2 text-xs text-slate-500">
          correctAnswer must be A, B, C, or D. Categories: Mathematics, English, General Knowledge, Programming, Science, History, Geography, Technology, Sports, Entertainment
        </p>
      </div>
    </div>
  )
}
