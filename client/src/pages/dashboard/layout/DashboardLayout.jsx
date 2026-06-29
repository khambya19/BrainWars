import { Outlet } from 'react-router-dom'

import MobileNav from './MobileNav.jsx'
import Sidebar from './Sidebar.jsx'

// This layout organizes the shared dashboard shell.

export default function DashboardLayout() {
  return (
    <div
      className="relative min-h-screen bg-void bg-gradient-dashboard text-text"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none fixed inset-0 opacity-[0.10]"
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
