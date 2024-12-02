import React from 'react'
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import db from '@/lib/supabase/db';
import DashboardSetup from '@/components/Dashboard/dashboard-setup';
import { getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

const dashboard = async () => {

    
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if(!user) return;

    const workspace = await db.query.workspaces.findFirst({
        where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),   
    }) //we do this query so that when a user deleted a workspace and
    // is redirected to /dashboard if he has any more workspaces, user
    //will be redirected to the very first workspace found in db after
    //deletion
 
    const { data: subscription, error: subscriptionError } = await getUserSubscriptionStatus(user.id) 

    if(subscriptionError) return

    if(!workspace){
        
        return (
            <div className='h-screen flex justify-center items-center'>
                <DashboardSetup user={user} subscription={subscription}/>
            </div>
        )
    }

    redirect(`/dashboard/${workspace.id}`)

}

export default dashboard