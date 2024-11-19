'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import React, { use, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod';  
import logo from '../../../../public/cypresslogo.svg'
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormSchema } from '@/lib/types';
import { actionSignUpUser } from '@/lib/server-actions/auth-actions';
import clsx from 'clsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Loader from '@/components/global/Loader';

import { MailCheck } from 'lucide-react'

const signUpFormSchema = z.object({
  
  email: z.string().describe('Email').email({ message: 'Invalid Email' }),    

  password: z.string().describe('Password').min(6, "Password must be minimum 6 characters"),

  confirmPassword: z.string().describe('Confirm Password').min(6, "Password must be minimum 6 characters")
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})



function SIGNUP_PAGE() {
  
  const router = useRouter();
  const searchParams = useSearchParams()

  const [submitError, setSubmitError] = useState('')
  const [confirmation, setConfirmation] = useState(false)

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '' , confirmPassword: '' }
  })

  const isLoading = form.formState.isSubmitting


  const codeExchangeError = useMemo(() => {
    if (!searchParams) return ''; // empty string means false in object property values

    return searchParams.get('error_description')

  }, [searchParams])

  const confirmationAndErrorStyles = useMemo(() => // so if false => no styles applied and vice versa
    clsx('bg-primary', {
      'bg-red-500/10': codeExchangeError,
      'border-red-500/50': codeExchangeError,
      'text-red-700': codeExchangeError
    })
  , [codeExchangeError])

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (formData) => {

    console.log("This is the formData: ", formData)

    const serializedData = JSON.parse(JSON.stringify(formData))


    const { error } = await actionSignUpUser(serializedData)

    if (error){
      setSubmitError(error.message)
      form.reset()
      return;
    }

    router.replace('/dashboard')
    setConfirmation(true)

  }
  
  return (
    <Form {...form}>
      <form
        className="flex flex-col w-[400px] gap-4 justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => {
          if (submitError) {
            setSubmitError("");
          }
        }}
      >
        <Link href="/" className="flex items-center w-fit">
          <Image src={logo} alt="logoImg" width={50} height={50} />

          <span className="font-semibold text-4xl first-letter:ml-2">
            Cypress
          </span>
        </Link>

        <FormDescription>All in one collaboration tool</FormDescription>


  {/* {
    !confirmation && !codeExchangeError && ( */}

    <>
      <FormField
        disabled={isLoading}
        control={form.control}
        name="email" //used as key in the formData that is sent to server later..
        render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              <Input type="email" placeholder="Email" {...field} />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        disabled={isLoading}
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              <Input type="password" placeholder="Password" {...field} />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
      disabled= {isLoading}
      control={form.control}
      name='confirmPassword'
      render={({ field, fieldState}) => (
        <FormItem>
          <FormControl>
            <Input type='password' placeholder="Confirm Password" {...field}/>
          </FormControl>
          { fieldState.error && (<FormMessage>{fieldState.error.message}</FormMessage> )}
        </FormItem>
      )}
      />

      {/* { submitError && <FormMessage> {submitError} </FormMessage> } */}

      <Button type="submit" disabled={isLoading} className='w-full'>
        { isLoading ? <Loader /> : 'Create Account}'}
      </Button>

    </>
    
    <span className="flex gap-1">
        <p>Already have an account?</p>

        <Link href="/login" className="text-primary">
          {"  "}
          Login{" "}
        </Link>
      </span>

    {/* {
      (confirmation || codeExchangeError) && (
        <>

          <Alert className={confirmationAndErrorStyles}>
            { !codeExchangeError && <MailCheck className='w-4 h-4'/> }
            <AlertTitle>
              { codeExchangeError ? 'Invalid Email' : 'Check your email' }
              <AlertDescription className='mt-3'>
                { codeExchangeError || 'An email confirmation has been sent' }
              </AlertDescription>

            </AlertTitle>

          </Alert>

        </>
      )
    } */}

      </form>
    </Form>
  )
}

export default SIGNUP_PAGE