import { Link } from 'react-router-dom'

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By creating an account or using BrainWars, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. We may update these terms at any time; continued use constitutes acceptance of any changes.`,
  },
  {
    title: '2. Description of Service',
    body: `BrainWars is a real-time multiplayer quiz platform where players compete in live tournaments using HP, speed scoring, and leaderboards. The service is provided "as is" and features may change without notice.`,
  },
  {
    title: '3. User Accounts',
    body: `You must be at least 13 years old to register. You are responsible for maintaining the security of your account credentials. You must not share your account, use another person's account, or create accounts for deceptive purposes. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: '4. Acceptable Use',
    body: `You agree not to: use the platform to harass, abuse, or harm others; attempt to gain unauthorised access to any part of the service; introduce malware, bots, or cheats; use automated scripts to interact with the platform; or engage in any activity that disrupts the service for other players.`,
  },
  {
    title: '5. Intellectual Property',
    body: `All content, branding, and software on BrainWars — including the name, logo, question sets, and interface design — is owned by BrainWars and protected by applicable intellectual property laws. You may not copy, reproduce, or distribute any part of the service without prior written consent.`,
  },
  {
    title: '6. Disclaimer of Warranties',
    body: `BrainWars is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `To the fullest extent permitted by law, BrainWars shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, even if we have been advised of the possibility of such damages.`,
  },
  {
    title: '8. Termination',
    body: `We reserve the right to suspend or terminate your access to BrainWars at any time, with or without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.`,
  },
  {
    title: '9. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the relevant courts.`,
  },
  {
    title: '10. Contact',
    body: `If you have questions about these Terms of Service, please contact us at hello@brainwars.gg.`,
  },
]

export default function TermsPage() {
  return (
    <div
      className="relative min-h-screen bg-void bg-gradient-legal text-text"
    >
      <header className="border-b border-pink-500/12 bg-void/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 transition duration-150 ease-out hover:opacity-80"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-pink-500/35 bg-pink-500/10 font-orbitron text-sm tracking-[0.06em]">
              BW
            </span>
            <strong className="font-orbitron text-[0.95rem] leading-none tracking-[-0.04em]">
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
          <h1 className="font-orbitron text-[clamp(2rem,5vw,3rem)] leading-none tracking-[-0.04em] text-text">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, i) => (
            <article
              key={section.title}
              className="animate-fade-in-up rounded-2xl border border-pink-500/10 bg-panel/60 p-6"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <h2 className="mb-3 font-orbitron text-[1rem] tracking-[-0.02em] text-text">
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
