import React, { useEffect, useState } from 'react';
import { supabase } from '../../CreateClient';
import { formatSemester, tableList } from '../../common/customHooks';
import toast from 'react-hot-toast';

const HomePage = () => {
    const [count, setCount] = useState({
        mcaStudents: {
            sem1: 0,
            sem2: 0,
            sem3: 0,
            sem4: 0
        },
        mscStudents: {
            sem1: 0,
            sem2: 0,
            sem3: 0,
            sem4: 0
        },
        teachers: 0,
        admin: 0
    });
    const [trackCallingTime, setTrackCallingTime] = useState(0)

    useEffect(() => {
        const fetchInitialData = async () => {
            setTrackCallingTime(prev => prev + 1);
            try {
                let mcaStudentsCount = { sem1: 0, sem2: 0, sem3: 0, sem4: 0 };
                let mscStudentsCount = { sem1: 0, sem2: 0, sem3: 0, sem4: 0 };
                let teachersCount = 0;
                let adminCount = 0;

                // Fetch data for students
                const studentPromises = tableList.map(async (val) => {
                    const { data: studentData, error: studentError } = await supabase
                        .from(val)
                        .select('*');

                    if (studentData.length > 0) {
                        studentData.forEach(record => {
                            if (record.department === 'MCA') {
                                mcaStudentsCount[`sem${record.semester}`]++;
                            } else if (record.department === 'MSc') {
                                mscStudentsCount[`sem${record.semester}`]++;
                            }
                        });
                    }
                });

                // Fetch data for teachers
                const { data: teachersData, error: teachersError } = await supabase
                    .from('teachers')
                    .select('*');

                if (teachersData) {
                    teachersCount = teachersData.length;
                }

                // Fetch data for admin
                const { data: adminData, error: adminError } = await supabase
                    .from('admin')
                    .select('*');

                if (adminData) {
                    adminCount = adminData.length;
                }

                await Promise.all(studentPromises);

                setCount({
                    mcaStudents: mcaStudentsCount,
                    mscStudents: mscStudentsCount,
                    teachers: teachersCount,
                    admin: adminCount
                });

            } catch (error) {
                toast.error('Error occurred while fetching data');
            }
        };

        if (trackCallingTime === 0) {
            toast.promise(fetchInitialData(), {
                loading: 'Loading...',
                success: 'Data fetched successfully',
                error: 'Error occurred while fetching data'
            }, {style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            setTrackCallingTime(1);
        }
    }, [trackCallingTime]);

    return (
        <div className=' grid grid-cols-2 lg:grid-cols-4 place-items-center gap-x-4 pt-3'>
            {[
                { title: 'Admins', count: count.admin },
                { title: 'Teachers', count: count.teachers },
                { title: 'MCA Students', data: count.mcaStudents, prefix: 'MCA' },
                { title: 'MSC Students', data: count.mscStudents, prefix: 'MSC' }
            ].map((category, index) => (
                <div key={index} className='bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-mavenPro text-lg p-3 rounded-lg mb-4 w-full h-full flex items-center justify- center'>
                    {category.count !== undefined ? (
                        <div>
                            <div className=' mb-2 bg-slate-800 rounded-full px-4 py-2'>Currently we have:</div>
                            {category.count} {category.title}
                        </div>
                    ) : (
                        <div>
                            <div className=' mb-2'>Currently we have:</div>
                            {Object.entries(category.data).map(([semester, count], i) => (
                                <div 
                                
                                key={i}>
                                    {count} students in {category.prefix} {formatSemester(semester.split('sem')[1])}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );    
        
};

export default HomePage;
