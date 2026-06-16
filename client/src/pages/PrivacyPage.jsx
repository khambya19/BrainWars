import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Information We Collect',
    body: `When you register, we collect your name, email address, and a hashed version of your password. During gameplay we collect in-game activity such as scores, streaks, and room participation. We do not collect payment information, location data, or device identifiers.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to create and manage your account, authenticate you securely via JSON Web Tokens (JWT), display your name and score on live leaderboards, and improve the BrainWars experience. We do not sell or rent your personal data to any third party.`,
  },
  {
    title: '3. Data Storage & Security',
    body: `Your data is stored on MongoDB Atlas with encrypted connections. Passwords are never stored in plain text — they are hashed using bcrypt with a salt factor of 12. All API endpoints are protected with rate limiting and HTTP security headers via Helmet.`,
  },
  {
    title: '4. Cookies & Local Storage',
    body: `BrainWars uses JWT tokens stored in memory or local storage to keep you signed in. We do not use advertising cookies or third-party tracking scripts. You can clear your browser storage at any time to sign out of all sessions.`,
  },
  {
    title: '5. Third-Party Services',
    body: `We use MongoDB Atlas for database hosting and Google Fonts for typography. These services have their own privacy policies. We do not share any personally identifiable information beyond what is required for these services to function.`,
  },
  {
    title: '6. Data Retention',
    body: `We retain your account data for as long as your account is active. If you request account deletion, we will permanently remove your personal information within 30 days, except where retention is required by law.`,
  },
  {
    title: '7. Your Rights',
    body: `You have the right to access, correct, or delete your personal data at any time. You may also request a copy of the data we hold about you. To exercise these rights, contact us at hello@brainwars.gg and we will respond within 14 days.`,
  },
  {
    title: '8. Children\'s Privacy',
    body: `BrainWars is not directed at children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal data, we will delete it immediately.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify registered users of significant changes by email. Continued use of BrainWars after changes take effect constitutes your acceptance of the updated policy.`,
  },
  {
    title: '10. Contact Us',
    body: `If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at hello@brainwars.gg. We take privacy seriously and will respond to all enquiries promptly.`,
  },
]

export default function PrivacyPage() {
  return (
    <div
      className="relative min-h-screen bg-[#0B0F1A] text-[#EDEFF5]"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(255,61,129,0.08), transparent 40%)',
      }}
    >
      <header className="border-b border-pink-500/12 bg-[#0B0F1A]/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 transition duration-150 ease-out hover:opacity-80"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-pink-500/35 bg-pink-500/10 font-['Orbitron'] text-sm tracking-[0.06em]">
              BW
            </span>
            <strong className="font-['Orbitron'] text-[0.95rem] leading-none tracking-[-0.04em]">
              BrainWars
            </strong>
          </Link>
          <Link
            to="/"
            className="text-sm text-slate-400 transition duration-150 hover:text-pink-400"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <div className="animate-fade-in-up mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Legal</p>
          <h1 className="font-['Orbitron'] text-[clamp(2rem,5vw,3rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, i) => (
            <article
              key={section.title}
              className="animate-fade-in-up rounded-2xl border border-pink-500/10 bg-[#141B2E]/60 p-6"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <h2 className="mb-3 font-['Orbitron'] text-[1rem] tracking-[-0.02em] text-[#EDEFF5]">
                {section.title}
              </h2>
              <p className="text-sm leading-7 text-slate-400">{section.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          Questions?{' '}
          <a href="mailto:hello@brainwars.gg" className="text-pink-400 hover:underline">
            hello@brainwars.gg
          </a>
        </p>
      </main>
    </div>
  )
}
