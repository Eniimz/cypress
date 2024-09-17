'use server'

import { error } from "console";
import { files, folders, users, workspaces } from "../../../migrations/schema";
import db from "./db";
import { file, folder, subscription, user } from "./supabase.types";
import { workspace } from "./supabase.types";
import { title } from "process";
import { and, eq, ilike, notExists } from "drizzle-orm";
import { collaborators } from "./schema";
import { use } from "react";



export const createWorkspace = async (workspace: workspace) => {

    try{
        const response = await db.insert(workspaces).values(workspace)
        return  { data: null, error: null }
    } catch(error){
        console.log(error)
        return { data: null, error: 'Error' }
    }
}

export const updateWorkspace = async (workspaceId: string, workspace: Partial<workspace>) => {

    try{

        const data = await db.update(workspaces).set(workspace)
        .where(eq(workspaces.id, workspaceId))

        return { data, error: null }

    }catch(error){

        console.log('Error in updating Workspace')
        return { data: null, error: 'Error in updating Workspace' }

    }

}

export const removeWorkspace = async (workspaceId: string) => {

    try{

        const data = await db.delete(workspaces)
        .where(eq(workspaces.id, workspaceId))

        return { data, error: null}


    }catch(error){

        console.log('Failed Deleting workspace');
        return { data: null, error: 'Failed Deleting workspace' }

    }

}

export const getWorkspace = async (workspaceId: string) => {

    try{

        const data = await db.select().from(workspaces)
        .where(eq(workspaces.id, workspaceId))

        return { data, error: null }

    }catch(error){

        console.log('Error in fetching Workspace details')
        return { data: null, error: 'Error in fetching Workspace details' }

    }

}

export const getUserSubscriptionStatus = async (userId: string) => {

    try{    

        const data = await db.query.subscriptions.findFirst({
        where: (s, {eq}) => eq(s.userId, userId)
        })

        return { data: data as subscription, error: null}

    }catch(error){
        return { data: null, error: `Error: ${error}`}
    }
}

export const getPrivateWorkspaces = async (userId: string) => {

    if(!userId) return

        const privateWorkspaces = await db.select({
            id: workspaces.id,
            createdAt: workspaces.createdAt,
            workspaceOwner: workspaces.workspaceOwner,
            title: workspaces.title,
            iconId: workspaces.iconId,
            data: workspaces.data,
            inTrash: workspaces.inTrash,
            logo: workspaces.logo,
            bannerUrl: workspaces.bannerUrl
        })
        .from(workspaces)
        .where(
            and(
                notExists(
                    db
                    .select()
                    .from(collaborators)
                    .where(eq(collaborators.workspaceId, workspaces.id))
                ),
                eq(workspaces.workspaceOwner, userId)
            )
        ) as workspace[]

        console.log("These are private workspaces: (from the server-side) ", privateWorkspaces)

        return privateWorkspaces;


}

export const getCollaboratedWorkspaces = async (userId: string) => {

    if(!userId) return

    const collaboratedWorkspaces = await db.select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl
    })
    .from(users)
    .innerJoin(collaborators, eq(collaborators.userId, users.id))
    .innerJoin(workspaces, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(users.id, userId)) as workspace[]

    console.log("These are collabotated workspaces: (from the server-side) ", collaboratedWorkspaces)

    return collaboratedWorkspaces

}

export const getSharedWorkspaces = async (userId: string) => {

    if(!userId) return;

    const sharedWorkspaces = await db.selectDistinct({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl
    })
    .from(workspaces)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId ))
    .where(eq(workspaces.workspaceOwner, userId)) as workspace[]

    console.log("These are the shared workspaces: (from the server-side) ", sharedWorkspaces)

    return sharedWorkspaces;
}

export const addCollaborators = async (users: user[], workspaceId: string) => {

    const check = users.map(async (user: user) => { 
        //when querying there is a need of adding the database table to be queried to the migrations/schema dir, otherwise we cant find the table in db.query.
        
        const userExists = await db.query.collaborators.findFirst({
            where: (u, {eq}) => and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId))
        }) //checks if the user already exists in the workspace
        if(!userExists){
            await db.insert(collaborators).values({ userId: user.id, workspaceId, avatarUrl: user.avatarUrl})
        }
    }) 

}

export const updateCollaborators = async (userId: string, user: Partial<user>) => {

    try{

        const data = await db.update(collaborators).set(user)
        .where(eq(collaborators.userId, userId))

        return { data, error: null }

    }catch(error){

        console.log('Error in updating collaborator')
        return { data: null, error: 'Error in updating collaborator' }

    }

}

export const removeCollaborators = async (users: user[], workspaceId: string) => {

    try{

        const data = users.map(async (user) => {

            await db.delete(collaborators)
            .where(
                and(
                    eq(collaborators.userId, user.id),
                    eq(collaborators.workspaceId, workspaceId)
                )
            )

        })

        return { data, error: null }

    }catch(error){

        console.log('Error in removing Collaborators')
        return { data: null, error: 'Error in removing Collaborators' }
    }

}


export const createFolder = async (folder: folder) => {

    const data = await db.insert(folders).values(folder)

    return { data }

}

export const createFile = async (file: file) => {

    try{

        const result = await db.insert(files).values(file)

        return { data: result, error: null }

    }catch(err){
        console.log('Error in creating File')
        return { data: null, error: null}
    }

}

export const updateFolder = async (folderId: string, folder: Partial<folder>) => {

    try{
        const result = await db.update(folders).set(folder).where(eq(folders.id, folderId))

        return { data: result, error: null}

    }catch(err){
        console.log("Error in updating folder")
        return { data: null, error: 'Error in updating folder' }
    }

}

export const getFolders = async (worskpaceId: string) => {

    try{

        const resultFolders = await db.select().from(folders)
        .where(eq(folders.workspaceId, worskpaceId)) as folder[]

        return {data: resultFolders, error: null};
    }
    catch(error){
        return{ data: null, error: 'Error in getting folders'}
    }

}

export const getFiles = async (workspaceId: string, folderId: string) => {

    try{

        const result = await db.select().from(files)
        .where(and(
            eq(files.workspaceId, workspaceId),
            eq(files.folderId, folderId)
        ))

        return { data: result, error: null }

    }catch(err){

        return { data: null, error: null }

    }

}

export const updateFile = async (
    folderId: string, 
    fileId: string,
    file: Partial<file>
) => {

    try{

        const result = await db.update(files).set(file)
        .where(
            eq(files.folderId, folderId)
        )

        return { data: result, error: null }

    }catch(error){
        console.log('Error during update File')
        return { data: null, error: 'Error during update File'}
    }

}


export const getCurrentUser = async (userId: string) => {

    try{

        const data = await db.select().from(users)
        .where(eq(users.id, userId))

        return { data, error: null }

    }catch(error){

        console.log("Error in getting current user")
        return { data: null, error: 'Error in getting current user' }

    }

}

export const updateUser = async (userId: string, user: Partial<user>) => {

    try{
        const data = await db.update(users).set(user)
        .where(eq(users.id, userId))
        
        await updateCollaborators(userId, user)

        return { data, error: null }

    }catch(error){

        console.log('Error in updating user')
        return { data: null, error: 'Error in updating user' }

    }

}



export const getUsers = async (userId: string) => {

    try{

        const data = await db.select().from(users)
        .where(eq(users.id, userId))

        return { data, error: null }

    }catch(error){
    
        console.log("Error in getting user")
        return { data: null, error: 'Error in getting user' }
        
    }

}

export const getSearchResults = async (email: string) => {

    const results = await db.select().
    from(users)
    .where(ilike(users.email, `${email}%`))

    return results;
}

