import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiLogout } from 'react-icons/ci';
import { useLocation, useParams } from 'react-router-dom';
import { supabase } from '../../CreateClient';

const navigationItems = [
    { name: 'Name', val: 'name' },
    { name: 'Email', val: 'emailId' },
    { name: 'Password', val: 'password' },
    { name: 'USN Id', val: 'usnId' },
];

const logoutOptions = [
    { text: 'LogOut', icon: <CiLogout /> },
];

const StudentHomePage = () => {
    const location = useLocation();
    const { tableName } = location.state;
    const { usnId } = useParams();
    console.log(tableName, usnId)

    useEffect(() => {
        toast.promise(
            (async () => {
                try {
                    const { data, error } = await supabase
                        .from(tableName)
                        .select('*')
                        .eq('usnId', usnId)
                        .single();
                    
                    if (error) {
                        console.error('Error querying database:', error.message);
                        toast.error('No student found with the provided credentials.', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        });
                        return;
                    }
    
                    if (!data) {
                        console.error('No data received from database.');
                        toast.error('No student found with the provided credentials.');
                        return;
                    }
                } catch (error) {
                    console.error('An unexpected error occurred:', error.message);
                    toast.error('An unexpected error occurred', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                }
            })(), {
                loading: 'Loading',
                success: 'Response received',
                error: 'Error occurred to get response'
            }, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            }
        );
    }, [tableName, usnId]); 

    return (
        <div>
            <h1>Student Home</h1>
        </div>
    );
}

export default StudentHomePage;
