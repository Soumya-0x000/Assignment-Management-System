import React, { useEffect, useState } from 'react';
import { 
    Button, 
    Dropdown, 
    DropdownItem, 
    DropdownMenu, 
    DropdownTrigger
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import { supabase } from '../../../../CreateClient';
import { BsSearch } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { setMode, setStudents } from '../../../../reduxStore/reducers/AdminDashboardSlice';
import StudentCard from '../StudentCard';
import { tableList } from '../../../../common/customHooks';

const SearchStudent = () => {
    const [searchBy, setSearchBy] = useState('name');
    const [searchTerm, setSearchTerm] = useState('Kishor das');
    const [searchResults, setSearchResults] = useState([]);
    const dispatch = useDispatch();

    const handleDropDown = (key) => {
        setSearchBy(key);
        setSearchTerm('');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchResults([]);
    
        try {
            const promises = tableList.map(async (val) => {
                const { data: studentData, error: studentError } = await supabase
                    .from(val)
                    .select('*')
                    .eq(searchBy, searchTerm);
                
                if(studentData.length > 0) {
                    return studentData;
                }
                return [];
            });
    
            const results = await Promise.all(promises);
            const flattenedResults = results.flat();
            
            if (flattenedResults.length > 0) {
                setSearchResults(flattenedResults);
                toast.success('Item found!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            } else {
                toast.error('Nothing found', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        } catch (error) {
            toast.error('not found');
        }
    };
    
    const handleSearchToast = (e) => {
        e.preventDefault();
        toast.promise(handleSearch(e), {
            loading: `Loading...`,
            success: `Search initiated!`,
            error: "Failed to initiate search.",
        },
        {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        });
    };

    useEffect(() => {
        dispatch(setMode('search'));
        dispatch(setStudents(searchResults));
    }, [searchResults]);

    return (
        <div className=' w-full flex flex-col items-center gap-y-8 relative overflow-y-auto'>
            {/* Dropdown and Searchbar */}
            <div className=" w-full grid grid-cols-4 gap-x-4 gap-y-8 sticky top-0 bg-slate-700 z-10">
                {/* dropdown */}
                <div className=' col-span-4 sm:col-span-1'>
                    <Dropdown className=' w-full'>
                        <DropdownTrigger className=' w-full'>
                            <Button 
                            className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${searchBy.length > 0 ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                            variant="bordered">
                                {searchBy ? `Search by ${searchBy}` : `Search by` }
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu aria-label="Static Actions" className=' w-full bg-slate-900 text-green-500 rounded-xl '
                        onAction={(key) => handleDropDown(key)}>
                            <DropdownItem key={'name'}>Name</DropdownItem>
                            <DropdownItem key={'emailId'}>Email</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                {/* searchbar */}
                <div className='relative w-full transition-all col-span-4 sm:col-span-3'>
                    <input
                        autoFocus={true}
                        type='text'
                        name='searchTerm'
                        id='searchTerm'
                        className={`border-2 rounded-xl pl-4 pr-12 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${searchTerm ? 'border-green-500' : ''} focus:border-green-500 focus:placeholder:-translate-x-7 transition-all peer w-full`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchToast(e)}
                        required={true}
                    />

                    <label
                    htmlFor='searchTerm'
                    className={`text-md text-green-500 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${searchTerm ? '-translate-y-[3.1rem] translate-x-[.5rem] text-sm' : ''} peer-focus:-translate-y-[3.1rem] peer-focus:translate-x-[.5rem] peer-focus:text-sm transition-all`}>
                        Search
                    </label>

                    <div className='cursor-pointer hover:scale-110 active:scale-90 text-2xl text-default-400 absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-lg transition-all'
                    onClick={handleSearchToast}>
                        <BsSearch className=''/>
                    </div>
                </div>
            </div>

            <StudentCard/>
        </div>
    )
}

export default SearchStudent;
