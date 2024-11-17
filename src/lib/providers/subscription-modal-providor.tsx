'use client'

import SubscriptionModal from "@/components/global/SubscriptionModal";
import SettingsForm from "@/components/settings/SettingsForm";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { ProductWithPrice } from "../supabase/supabase.types";

type subscriptionModalContextType = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const SubscriptionModalContext = createContext<subscriptionModalContextType | undefined>(undefined)

export const useSubscriptionModal = () => {
    const context = useContext(SubscriptionModalContext)
    console.log("THE CONTEXT OF SUBSCRIPtion modal: ", context)
    
    if(!context){
        throw new Error('useSubscriptionModal must be used within a context providor')
    }

    return context
}
type SubscriptionModalProvidorProps = {
    children: React.ReactNode,
    products: ProductWithPrice[]
}

export const SubscriptionModalProvider: React.FC<SubscriptionModalProvidorProps> = ({
    children,
    products
}) => {

    const [open, setOpen] = useState(false)

    return (
        <SubscriptionModalContext.Provider value={{open, setOpen}}>
            {children}
            <SubscriptionModal products = { products } />
        </SubscriptionModalContext.Provider>
    )


}
