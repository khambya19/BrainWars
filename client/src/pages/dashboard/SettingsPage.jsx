import { AlertTriangle, Key, User } from 'lucide-react'

function SettingBlock({ title, description, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-6">
      <div className="mb-1 flex items-center gap-2 text-[#EDEFF5]">
        {Icon && <Icon size={15} className="text-pink-400" aria-hidden="true" />}
        <h2 className="font-['Orbitron'] text-[0.9rem] tracking-[-0.03em]">{title}</h2>
      </div>
      {description && <p className="mb-4 text-sm text-slate-400">{description}</p>}
      {children}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div>
      <div className="animate-fade-in-up mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Preferences</p>
        <h1 className="font-['Orbitron'] text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
          Settings
        </h1>
      </div>

      <div className="grid gap-4">
        <div className="animate-fade-in-up" style={{ animationDelay: '60ms' }}>
          <SettingBlock
            icon={User}
            title="Display name"
            description="Change how your name appears on leaderboards and in game rooms."
          >
            <div className="flex gap-2">
              <input
                disabled
                placeholder="Coming soon"
                className="min-h-11 flex-1 cursor-not-allowed rounded-xl border border-pink-500/12 bg-[#0B0F1A]/60 px-4 text-sm text-slate-500 placeholder:text-slate-600 outline-none"
              />
              <button
                disabled
                className="min-h-11 cursor-not-allowed rounded-xl border border-pink-500/12 bg-pink-500/8 px-5 text-sm text-slate-500"
              >
                Save
              </button>
            </div>
          </SettingBlock>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <SettingBlock
            icon={Key}
            title="Change password"
            description="Update your login credentials. You'll need your current password."
          >
            <div className="grid gap-2">
              <input
                disabled
                type="password"
                placeholder="Current password — coming soon"
                className="min-h-11 cursor-not-allowed rounded-xl border border-pink-500/12 bg-[#0B0F1A]/60 px-4 text-sm text-slate-500 placeholder:text-slate-600 outline-none"
              />
              <input
                disabled
                type="password"
                placeholder="New password — coming soon"
                className="min-h-11 cursor-not-allowed rounded-xl border border-pink-500/12 bg-[#0B0F1A]/60 px-4 text-sm text-slate-500 placeholder:text-slate-600 outline-none"
              />
              <button
                disabled
                className="min-h-11 cursor-not-allowed rounded-xl border border-pink-500/12 bg-pink-500/8 text-sm text-slate-500"
              >
                Update password
              </button>
            </div>
          </SettingBlock>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '180ms' }}>
          <div className="rounded-2xl border border-[#FF5A4E]/20 bg-[#FF5A4E]/5 p-6">
            <div className="mb-1 flex items-center gap-2 text-[#FF5A4E]">
              <AlertTriangle size={15} aria-hidden="true" />
              <h2 className="font-['Orbitron'] text-[0.9rem] tracking-[-0.03em]">Danger zone</h2>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              disabled
              className="min-h-10 cursor-not-allowed rounded-xl border border-[#FF5A4E]/20 bg-[#FF5A4E]/8 px-4 text-sm text-[#FF5A4E]/40"
            >
              Delete account — coming soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
