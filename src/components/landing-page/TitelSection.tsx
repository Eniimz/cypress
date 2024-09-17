import React from 'react'

function TitelSection() {
  return (
    <React.Fragment>

      <section className='flex flex-col items-center justify-center gap-6 mt-6 '>
        <article className='rounded-full 
        dark:bg-gradient-to-r
        dark:from-brand-primaryBlue
        dark:to-brand-primaryPurple
        p-[1px]
        text-sm

        '>
          <div className='rounded-full py-1 px-2 dark:bg-black'>
            - Your Workspace, perfected!
          </div>
        </article>

        <h1 className='text-6xl text-center font-bold text-washed-purple-400 w-[1100px]'>
          All-In-One Collaboration and Production Platform
        </h1>

      </section>

    </React.Fragment>
  )
}

export default TitelSection