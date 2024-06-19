import React, { useEffect } from 'react'
import { supabase } from '../../../CreateClient';

const PendingAdmins = () => {
    useEffect(() => {
        (async() => {
            const {data: pendingData, error: pendingError} = await supabase
                .from('pendingAdmin')
                .select('*')
                // .order('createdAt', { ascending: true });

            console.log(pendingData);
        })();
    }, []);

    return (
        <div>PendingAdmins</div>
    )
}

export default PendingAdmins;
