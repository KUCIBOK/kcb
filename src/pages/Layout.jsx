import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/landing/Header'
import { Footer } from '../components/landing/Footer'
import { TrialBanner } from '../components/shared/TrialBadge'

export const Layout = memo(function Layout() {
  return (
    <>
      <Header />
      <TrialBanner />
      <Outlet />
      <Footer />
    </>
  )
})
