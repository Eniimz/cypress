'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { subscription, user } from "../supabase/supabase.types";
import { AuthUser } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getUserSubscriptionStatus } from "../supabase/queries";
import { toast } from "@/components/ui/use-toast";

type supabaseContext = {
    user: AuthUser | null,
    subscription: subscription | null | undefined
}

const supabaseContext = createContext<supabaseContext>({
    user: null,
    subscription: null
})

export const useSupabaseContext = () => {

    const context = useContext(supabaseContext);

    if(!context){
        throw new Error('useSupabaseContex must be used within supabase user provider')
    }

    return context

}

type supabaseUserProviderProps = {
    children: React.ReactNode
}

const SupabaseUserProvider: React.FC<supabaseUserProviderProps> = ({ children }) => {

    const supabase = createClientComponentClient();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [subscription, setSubscription] = useState<subscription | null>()


    useEffect(() => {

        const getUser = async () => {

            const { data: { user } } = await supabase.auth.getUser()

            if(!user){
                toast({
                    variant: 'destructive',
                    description: 'User wasnt found'
                })
            }

            if(user){
                console.log("The user from supabaseProvider: ", user)
                setUser(user)
                const { data, error } = await getUserSubscriptionStatus(user.id)

                if(error){
                    toast({
                        variant: 'destructive',
                        description: 'The user subscription is not valid'
                    })
                }

                if (data){
                    setSubscription(data)
                }
            }   

        }

        getUser()
    }, [supabase])

    return (

        <supabaseContext.Provider  value={{ user, subscription }}>
            {children}
        </supabaseContext.Provider>

    )

}

export default SupabaseUserProvider;

