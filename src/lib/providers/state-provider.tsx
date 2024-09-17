'use client'

import { act, Children, createContext, Dispatch, useContext, useEffect, useMemo, useReducer } from "react"
import { file, folder, user, workspace } from "../supabase/supabase.types"
import { workspaces } from "../supabase/schema"
import { usePathname } from "next/navigation"
import { getFiles } from "../supabase/queries"
import { useSupabaseContext } from "./supabaseUserProvider"


type appFoldersType = folder & { files : file[] | [] }

type appWorkspacesType = workspace & { folders:  appFoldersType[] | [] }

type AppState = {
    workspaces: appWorkspacesType[] | [],
    currentUser: Partial<user> | null
}

type Action =
| { type: 'ADD_WORKSPACE', payload: appWorkspacesType }

| { type: 'SET_WORKSPACES', payload: { workspaces: appWorkspacesType[]} }

| {
    type: 'UPDATE_WORKSPACE',
    payload: {
        workspaceId: string,
        workspace: Partial<appWorkspacesType>
    }
}

| {
    type: 'DELETE_WORKSPACE',
    payload: {
        workspaceId: string,
        workspace: appWorkspacesType
    }
}

| { 
    type: 'SET_FOLDERS', 
    payload: { workspaceId: string, folders: appFoldersType[] }
}

| { 
    type: 'ADD_FOLDER', 
    payload: { workspaceId: string, folder: appFoldersType } 
}
| {
    type: 'UPDATE_FOLDER',
    payload: {
        folderId: string,
        workspaceId: string,
        folder: Partial<appFoldersType>
    }  
}
| { 
    type: 'ADD_FILE',
    payload: {
        workspaceId: string,
        folderId: string,
        file: file
    }
}

| {
    type: 'SET_FILES',
    payload: {
        workspaceId: string,
        folderId: string,
        files: file[]
    }
}

| {
    type: 'UPDATE_FILE',
    payload: {
        workspaceId: string,
        folderId: string,
        fileId: string,
        file: Partial<file>
    }
}

| {
    type: 'SET_CURRENT_USER',
    payload: {
        user: Partial<user>
    }
}

const initialState: AppState = {
    workspaces: [],
    currentUser: null
}

const appReducer = (state: AppState, action: Action): AppState => {
    
    switch(action.type){
        
        case 'ADD_WORKSPACE':
            return {
                ...state,
                workspaces : [...state.workspaces, action.payload]
            }

        case 'SET_WORKSPACES':
            return {
                ...state,
                workspaces: action.payload.workspaces
            }

        case 'UPDATE_WORKSPACE':
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    if(workspace.id === action.payload.workspaceId){
                        return {
                            ...workspace,
                            ...action.payload.workspace
                        }
                    }
                    return workspace
                })
            }

        case 'ADD_FOLDER':
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    if( workspace.id === action.payload.workspaceId ){
                        return {
                            ...workspace,
                            folders: [...workspace.folders, action.payload.folder ].sort(
                                (a, b) => 
                                    new Date(a.createdAt).getTime() -
                                    new Date(b.createdAt).getTime()
                            ) 
                        }
                    }

                    return workspace
                })
            }
            
        case 'SET_FOLDERS': 
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    if(workspace.id == action.payload.workspaceId){
                        return {
                            ...workspace,
                            folders: action.payload.folders.sort(
                                (a, b) =>
                                    new Date(a.createdAt).getTime() -
                                    new Date(b.createdAt).getTime()
                            )
                        }
                    }
                    return workspace
                })
            }

        case 'UPDATE_FOLDER': 
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    if(workspace.id === action.payload.workspaceId){
                        return {
                            ...workspace,
                            folders: workspace.folders.map(folder => {
                                if(folder.id === action.payload.folderId){
                                    return {
                                        ...folder,
                                        ...action.payload.folder
                                    }
                                }
                                return folder
                            })
                        }
                    }
                    return workspace
                })
            }

        case 'ADD_FILE':
            return {
                ...state,
                workspaces: state.workspaces.map(workspace => {
                    if(workspace.id === action.payload.workspaceId){
                        return {
                            ...workspace,
                            folders: workspace.folders.map((folder) => {
                                if(folder.id === action.payload.folderId){
                                    return {
                                        ...folder,
                                        files: [...folder.files, action.payload.file].sort(
                                            (a,b) =>
                                                new Date(a.createdAt).getTime() -
                                                new Date(b.createdAt).getTime()
                                        )
                                    }
                                }
                                return folder
                            })
                        }
                    }
                    return workspace
                })
            }

        case 'DELETE_WORKSPACE':
            return {
                ...state,
                workspaces: state.workspaces.filter((workspace) => workspace.id !== action.payload.workspaceId)
            }

        case 'SET_FILES':
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    if(workspace.id === action.payload.workspaceId){
                        return{
                            ...workspace,
                            folders: workspace.folders.map((folder) => {
                                if(folder.id === action.payload.folderId){
                                    return {
                                        ...folder,
                                        files: action.payload.files
                                    }
                                }
                                return folder
                            })
                        }
                    }
                    return workspace
                })
            }

        case 'UPDATE_FILE':
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    if(workspace.id === action.payload.workspaceId){
                        return {
                            ...workspace,
                            folders: workspace.folders.map((folder) => {
                                if(folder.id === action.payload.folderId){
                                    return {
                                        ...folder,
                                        files: folder.files.map((file) => {
                                            if(file.id === action.payload.fileId){
                                                return {
                                                    ...file,
                                                    ...action.payload.file
                                                }
                                            }
                                            return file
                                        })
                                    }
                                }
                                return folder
                            })
                        }
                    }
                    return workspace
                })
            }

            case 'SET_CURRENT_USER':
                return {
                    ...state,
                    currentUser : {
                        ...state.currentUser,
                        ...action.payload.user
                    }
                }   
            
        

        default:
                return state    
        }
            
        }
        
type AppContext = {
    state: AppState,
    dispatch: Dispatch<Action>
    workspaceId: string | undefined,
    folderId: string | undefined,
    fileId: string | undefined
}

const AppContext = createContext< AppContext | null >(null)

type AppStateProviderProps = {
    children: React.ReactNode
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {

    const [ state, dispatch ] = useReducer(appReducer, initialState)
    const pathname = usePathname()

    const workspaceId = useMemo(() => {
        const urlSegments = pathname.split('/').filter(Boolean)
        if(urlSegments.length > 1){ // '/dashboard/workspaceId'
            return urlSegments[1]
        }
    }, [pathname])

    const folderId = useMemo(() => {
        const urlSegments = pathname.split('/').filter(Boolean)
        if(urlSegments.length > 2){ // '/dashboard/workspaceId/folderId'
            return urlSegments[2]
        }
    }, [pathname])

    const fileId = useMemo(() => {
        const urlSegments = pathname.split('/').filter(Boolean)

        if(urlSegments.length > 3){ // '/dashboard/workspaceId/folderId/fileId'
            return urlSegments[3]
        }

    }, [pathname])

    useEffect(() => {
        if(!workspaceId || !folderId) return

        const fetchFiles = async () => {

            const { data, error } = await getFiles(workspaceId, folderId)
            
            if(error){
                console.log(error)
            }

            if(data){
                dispatch({
                    type: 'SET_FILES',
                    payload: {
                        workspaceId,
                        folderId,
                        files: data
                    }
                })
            }
        }


        fetchFiles()

    }, [folderId, workspaceId])



    return (
        <AppContext.Provider value={{ state, dispatch, workspaceId, folderId, fileId }}>
            {children}
        </AppContext.Provider>
    )

}

export default AppStateProvider;

export const useAppContext = () => {

    const context = useContext(AppContext)

    if(!context){
        throw new Error('useAppContext must be used within an AppStateProvider')
    }

    return context;
}