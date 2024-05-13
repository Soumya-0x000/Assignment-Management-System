import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useState } from 'react'
import { supabase } from '../../../../CreateClient';
import { BsSearch } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { staggerVariants } from '../../../../common/Animation';

const SearchAdmin = () => {
    const [searchBy, setSearchBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleDropDown = (key) => {
        setSearchBy(key);
        setSearchTerm('');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        const { data, error } = await supabase
            .from('admin')
            .select('*')
            .eq(searchBy, searchTerm)
            .limit(10)
            .order(searchBy, { ascending: true })

        if(error) {
            toast.error('No results found...')
        } else {
            toast.success('Search item has been found', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
            setSearchResults(data)
        }
    };

    const handleSearchToast = (e) => {
        e.preventDefault();
        toast.promise(handleSearch(e), {
            loading: `Searching...`,
            success: `Successfully searched!`,
            error: "Failed to search.",
        })
    };

    return (
        <form className=' w-full flex flex-col items-center gap-y-8'>
            <div className=" w-full grid grid-cols-4 gap-x-4">
                {/* dropdown */}
                <div className=' col-span-1'>
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
                <div className='relative w-full transition-all col-span-3'>
                    <input
                        autoFocus={true}
                        type='text'
                        name='searchTerm'
                        id='searchTerm'
                        className={`border-2 rounded-xl pl-4 pr-12 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${searchTerm ? 'border-green-500' : ''} focus:border-green-500 focus:placeholder:-translate-x-7 transition-all peer w-full`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchToast()}
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

            <div className=' w-full flex flex-col items-center justify-center gap-y-4'>
                <div className=' text-md text-green-500 font-onest'>Search Results</div>
                <div className=' w-full h-full overflow-y-auto flex flex-wrap'>

                <motion.div className='flex items-center justify-center flex-wrap overflow-y-auto gap-5 sm:gap-7 lg:gap-9 xl:gap-14 2xl:gap-16'
                variants={staggerVariants}
                initial='initial'
                animate='animate'>
                    {dataForCanvas?.map((data, indx) => (
                        data && (
                            <motion.div 
                            key={data.emailId + indx}
                            className='flex flex-wrap flex-col items-center justify-center p-2 bg-[#121118bb] rounded-lg group'>
                                {/* private details */}
                                <div className='space-y-2 w-full'>
                                    {/* name */}
                                    <p className='text-[1.3rem] font-bold text-[#5bffd0fb] font-onest tracking-wide line-clamp-1'>
                                        {data.title} {data.name}
                                    </p>

                                    {/* email, password and auth code */}
                                    <div className='flex flex-col items-start gap-y-1 w-full'>
                                        <div className='flex items-center gap-x-3'>
                                            <MdOutlineMailOutline className='text-xl'/> {data.emailId}
                                        </div>

                                        <div className='flex items-center gap-x-3'>
                                            <LockIcon className='h-5 w-5 text-[#20e9b0e8]'/>
                                            <input
                                                type='password'
                                                className='outline-none bg-transparent w-full text-[#20e9b0e8] font-mavenPro'
                                                value={data.password}
                                                disabled
                                            />
                                        </div>

                                        <div className='flex items-center gap-x-3'>
                                            <HiOutlineLockClosed className='text-xl'/> {data.authCode}
                                        </div>
                                    </div>
                                </div>

                                {/* logo */}
                                <div className='mt-3 min-w-14 max-w-14 min-h-14 max-h-14 bg-[#c993ff] shadow-md shadow-orange-500 font-bold text-violet-800 rounded-full overflow-hidden flex items-center justify-center mr-1'>
                                    {nameLogo(data.name)}
                                </div>

                            </motion.div>
                        )
                    ))}
                </motion.div>
            </div>
            </div>
        </form>
    )
}

export default SearchAdmin;

