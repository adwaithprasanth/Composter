import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const DocsLayout = () => {
  return (
    <div className="h-screen bg-[#060010] text-white font-[font]">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 h-full">
        <div className="grid" style={{ gridTemplateColumns: '16rem 1fr', gap: '2.5rem', height: '100%' }}>
          <aside className="w-64">
            <div className="sticky top-24">
              <h3 className="text-2xl font-medium text-zinc-400 mt-18">Docs</h3>
              <nav className="flex flex-col gap-3 mt-8">
                <Link to="." className="text-lg font-medium text-white hover:text-violet-300">Introduction</Link>
                <Link to="installation" className="text-lg font-medium text-white hover:text-violet-300">Installation</Link>
                <Link to="cli" className="text-lg font-medium text-white hover:text-violet-300">CLI</Link>
                <Link to="manual" className="text-lg font-medium text-white hover:text-violet-300">Manual</Link>
              </nav>
            </div>
          </aside>

          <main className="overflow-auto h-full pr-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DocsLayout
