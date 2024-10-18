import { NextApiResponseServerIo } from "@/lib/types"
import { NextApiRequest } from "next"
import { Server as NetServer } from 'http'
import {Server as ServerIO} from 'socket.io'

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = ( req: NextApiRequest, res: NextApiResponseServerIo ) => {

    if(!res.socket.server.io){
        
        const path = '/api/socket/io'
        const httpServer: NetServer = res.socket.server as any

        try{

                const io = new ServerIO(httpServer, {
                    path,
                    addTrailingSlash: false
                })
        
        
                io.on('connection', (s) => {
                    s.on('create-room', (fileId) => {
                        console.log("I joined the room: ", fileId)
                        s.join(fileId)
                    })
        
                    s.on('send-changes', (delta, fileId) => {
                        console.log("The send chaanges event ran: ", fileId)
                        s.to(fileId).emit('receive-changes', delta, fileId)
                    })

                    s.on('A check', () => {
                        console.log("The check works")
                    })
                })
        
                res.socket.server.io = io
        
            }catch(err){
                console.log("The socket error in the server: ", err)
                res.status(500).send('Internal Server Error')
            }
        
            res.end()
        }


}

export default ioHandler;