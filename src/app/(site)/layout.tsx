import Header from '@/components/landing-page/Header';
import React from 'react'


function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <main >
    <div>
      <Header />
      {children}
      </div>
  </main>
  )
}

export default HomePageLayout