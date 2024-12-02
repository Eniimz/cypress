import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarImage } from '../ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'
import { features, title } from 'process'
import { v4 } from 'uuid'
import Image from 'next/image'
import { Button } from '../ui/button'
import diamond from '../../../public/icons/diamond.svg'
import checkIcon from '../../../public/icons/check.svg'
import { Span } from 'next/dist/trace'
import PlanButton from './Go-to-plan-button'


type CustomCardProps = {
    avatar?: string,
    name ?: string,
    review?: string,
    classname ?: string,
    planType ?: string,
    price ?: string,
    description ?: string,
    highlightFeature ?: string
    features ?: string[]

}

const CustomCard: React.FC<CustomCardProps> = ({
    avatar,
    name,
    review,
    classname,
    description,
    features,
    highlightFeature,
    planType,
    price
}) => {
  return (
    <Card
    className={cn('w-[380px]', classname, {
        'border-brand-primaryPurple/40 shadow-[0_0_9px_2px_rgba(112,0,255,0.25)]'
        : planType === 'Pro Plan'
    })}
    >

        {planType === 'Pro Plan' &&
        <>
            <div
            className='absolute
            top-0
            h-32
            w-full
            bg-brand-primaryPurple/80
            blur-[120px]
            rounded-full
            -z-30

            '
            />

            {/* <div
            className='absolute
            top-0
            left-24
            right-0
            bottom-[70%]
            bg-brand-primaryPurple/40
            blur-[120px]
            '
            /> */}
        </>
            
        }

        <CardHeader>
        {avatar ?
            <div
            className='flex 

            justify-start
            rounded-md
            gap-2
            '
            >
                <Avatar
                className='flex justify-center items-center'
                >
                    <AvatarImage src={avatar}  />
                    <AvatarFallback >CN</AvatarFallback>
                </Avatar>       
                
                <article
                className='mt-[-2px] flex flex-col
                items-start
                '
                >
                    <p className='text-washed-blue-200 font-bold text-lg'> {name} </p>
                    <small className='text-muted-foreground mt-[-6px]'> {name?.toLocaleLowerCase()} </small>
                </article>

            </div>
        :
        
            <CardTitle>

                <div className='flex justify-between'>
                
                    <p className='text-2xl dark:text-white'> {planType} </p>

                    { planType === 'Pro Plan' &&  <Image src={diamond} alt='diamond' />}

                </div>
            </CardTitle>
        }
        </CardHeader>

        <CardContent
        className=''
        >
            {
                review ?
                <p className='text-muted-foreground'> {review} </p>
                :
                <div
                className='flex flex-col
                gap-4
                '
                >

                    <div className='flex flex-col w-full
                    gap-4
                    '>
                        <div className='flex flex-col gap-1'>
                            <p className='text-2xl font-bold'>
                                ${price}{planType === 'Pro Plan' && <span className='text-sm text-muted-foreground font-normal'>/mo</span>}
                            </p>

                            <article className='text-muted-foreground
                            text-sm
                            '>
                                {description}
                            </article>

                        </div>
                    
                    <PlanButton 
                    planType = {planType}
                    />

                    </div>

                    <p className='mt-3 text-sm text-muted-foreground'>{highlightFeature}</p>

                    <div className='flex flex-col gap-4 text-washed-purple-200/70 w-full'>
                        {
                            features?.map((feature) => (
                                <div
                                key={v4()}
                                className='flex gap-3'
                                >
                                    <Image src={checkIcon} alt='tick' />
                                    <p> {feature} </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                
            }
        </CardContent>

    </Card>
  )
}

export default CustomCard