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
      className="relative min-h-screen overflow-x-hidden bg-void bg-gradient-home font-sans text-text"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none fixed inset-0 opacity-20"
        style={{
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
