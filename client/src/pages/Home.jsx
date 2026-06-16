import AboutSection from '../components/AboutSection.jsx'
import CTASection from '../components/CTASection.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import StatsStrip from '../components/StatsStrip.jsx'

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#0B0F1A] font-sans text-[#EDEFF5]"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(255, 61, 129, 0.12), transparent 28%), radial-gradient(circle at 82% 10%, rgba(198, 255, 61, 0.08), transparent 20%)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.95), transparent 92%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.95), transparent 92%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-295 px-4 py-3 sm:px-6">
        <Header />
        <Hero />
        <StatsStrip />
        <HowItWorks />
        <AboutSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
