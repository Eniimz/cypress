import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { price } from "./supabase/supabase.types"

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }


export const postData = async (url: string, data ?: price | string) => {

  const result: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    credentials: 'same-origin',
    body: data ? JSON.stringify(data) : ''
  })

  if(!result.ok){
    console.log('Error in post data: ', { url, data, result })
  }

  return result.json()

}

export const getUrl = () => {

  let url = process.env.NEXT_PUBLIC_SITE_URL ?? 
  'http://localhost:3000/'

  url = url.includes('http') ? url : `https://${url}/`

  url = url.charAt(url.length - 1) === '/' ? url : `${url}/` //checking if theres a slash at the end

  return url;

}

export const formatPrice = (price: price) => {

  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency || undefined,
    minimumFractionDigits: 0
  }).format((price.unitAmount || 0)/ 100);

  return priceString

}

export const toDateTime = (seconds: number) => {

  const t = new Date('1970-01-01T00:30:00Z')
  t.setSeconds(seconds)

  return t

}