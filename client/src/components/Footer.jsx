import { Mail, MessageCircle, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const productLinks = [
  { label: 'Home',         href: '#home'         },
  { label: 'How it works', href: '#how-it-works'  },
  { label: 'Features',     href: '#features'      },
  { label: 'About',        href: '#about'         },
]

const communityLinks = [
  { label: 'Discord server', href: 'https://discord.com' },
  { label: 'X / Twitter',    href: 'https://x.com'       },
  { label: 'Leaderboard',    href: '#'                    },
  { label: 'Hall of fame',   href: '#'                    },
]

const companyLinks = [
  { label: 'Terms of service', href: '/terms',                       internal: true  },
  { label: 'Privacy policy',   href: '/privacy',                     internal: true  },
  { label: 'Contact us',       href: 'mailto:hello@brainwars.gg',    internal: false },
]

const socialLinks = [
  { label: 'X / Twitter', href: 'https://x.com',             icon: X             },
  { label: 'Discord',     href: 'https://discord.com',        icon: MessageCircle },
  { label: 'Email',       href: 'mailto:hello@brainwars.gg',  icon: Mail          },
]

function FooterColumn({ heading, links }) {
  return (
    <div className="grid gap-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#EDEFF5]">{heading}</p>
      <ul className="grid gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.internal ? (
              <Link
                to={link.href}
                className="text-sm text-slate-400 transition duration-150 ease-out hover:-translate-y-px hover:text-pink-400"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="text-sm text-slate-400 transition duration-150 ease-out hover:-translate-y-px hover:text-pink-400"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="animate-fade-in border-t border-pink-500/14 pt-12 pb-8" id="footer">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="grid gap-5 content-start">
          <div>
            <p className="font-['Orbitron'] text-[1.05rem] leading-none tracking-[-0.04em] text-[#EDEFF5]">
              BrainWars
            </p>
            <p className="mt-2 max-w-[28ch] text-sm leading-6 text-slate-400">
              Real-time quiz tournaments with HP, speed scoring, and live leaderboards.
            </p>
          </div>
          <div className="flex items-center gap-2.5" aria-label="Social links">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-pink-500/16 bg-[#141B2E] text-slate-400 transition duration-150 ease-out hover:-translate-y-px hover:border-pink-500/40 hover:text-pink-400"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn heading="Product"   links={productLinks}   />
        <FooterColumn heading="Community" links={communityLinks} />
        <FooterColumn heading="Company"   links={companyLinks}   />
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-pink-500/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} BrainWars. All rights reserved.</p>
        <p>Built for players, by players.</p>
      </div>
    </footer>
  )
}
