import Navbar from '@/components/marketing/Navbar'
import { FC, ReactNode } from 'react'

interface layoutProps {
  children: ReactNode
}

const MarketingLayout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      {/* This navbar is for marketing page */}
      <Navbar />
      <main className="h-full pt-40">
        {children}
      </main>
    </div>
  )
}

export default MarketingLayout