import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/landing/Header'
import { Footer } from '../components/landing/Footer'

export const Layout = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
})
