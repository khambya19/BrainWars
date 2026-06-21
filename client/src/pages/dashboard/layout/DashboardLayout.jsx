import { Outlet } from 'react-router-dom'

import MobileNav from './MobileNav.jsx'
import Sidebar from './Sidebar.jsx'

export default function DashboardLayout() {
  return (
    <div
      className="relative min-h-screen bg-[#0B0F1A] text-[#EDEFF5]"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(255,61,129,0.08), transparent 30%), radial-gradient(circle at 80% 80%, rgba(198,255,61,0.04), transparent 40%)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <Sidebar />

      <main className="relative z-10 pb-24 lg:pl-64 lg:pb-8">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
