'use client'

import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'



type PlanButtonProps = {
    planType: string | undefined
}

const PlanButton: React.FC<PlanButtonProps> = ({ planType }) => {
    
    const router = useRouter()

    const goToPlan = () => {
    
        router.replace('/signup')

    }


    return (
    <Button 
    className='w-full text-lg p-5'
    variant={'btn-primary'}
    onClick={goToPlan}>
        { planType === 'Pro Plan' ? 'Go Pro' : 'Get Started' }
    </Button>
  )
}

export default PlanButton