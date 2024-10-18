import { NextApiResponse } from 'next';
import { Socket, Server as NetServer } from 'net'
import { Server as SocketIOServer } from 'socket.io'
import {z} from 'zod';

export const FormSchema = z.object({ 
    email: z.string().describe('Email').email({ message: 'Invalid Email' }),
    password: z.string().describe("Password").min(1, "Password is required")
})

export const workspaceFormSchema = z.object({
    workspaceName: z.string().describe('Workspace Name').min(1, 'Workspace must be min 1 character'),
    logo: z.any()
})

export const bannerSchema = z.object({
    banner: z.any()
})

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };