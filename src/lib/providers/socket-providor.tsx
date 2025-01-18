'use client'


import { boolean } from "drizzle-orm/mysql-core"
import React, { createContext, useContext, useEffect, useState } from "react"
import { io as ClientIo } from 'socket.io-client';

type SocketContextType = {
    socket: any | null,
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false 
})

export const useSocket = () => {
    return useContext(SocketContext)
}

type SocketProvidorProps = {
    children: React.ReactNode
}

export const SocketProvidor: React.FC<SocketProvidorProps> = ({ children }) => {

    const [socket, setSocket] = useState()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cypress-a-collaboration-tool-production.up.railway.app"
    
        const socketInstance = new (ClientIo as any)(
            backendUrl, {
            path: '/api/socket/io',  // Ensure this matches your backend
            withCredentials: true,
            addTrailingSlash: false
        });
    
        socketInstance.on('connect', () => setIsConnected(true));
        socketInstance.on('disconnect', () => setIsConnected(false));
    
        setSocket(socketInstance);
    
        return () => socketInstance.disconnect();
    }, []);
    

    return (
        <SocketContext.Provider value={ {socket, isConnected} }>
            {children}
        </SocketContext.Provider>
    )


}