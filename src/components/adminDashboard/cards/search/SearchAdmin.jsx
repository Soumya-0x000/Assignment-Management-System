import { useEffect, useState } from 'react';
import { supabase } from '../../../../CreateClient';
import { BsSearch } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { MdOutlineMailOutline, MdOutlineLock, MdOutlineLockOpen } from 'react-icons/md';
import { FiTrash2 } from 'react-icons/fi';
import { 
    Button, 
    Dropdown, 
    DropdownItem, 
    DropdownMenu, 
    DropdownTrigger, 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    Tooltip, 
    useDisclosure
} from '@nextui-org/react';
import { motion } from 'framer-motion';
import { nameLogo } from '../../../../common/customHooks';
import { TbLockAccess, TbLockAccessOff } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { childVariants, staggerVariants } from '../../../../common/Animation';
import { RenderDeptClass } from '../RenderDeptClass';

const SearchAdmin = ({mode, selected}) => {
    const [searchBy, setSearchBy] = useState('name');
    const [searchTerm, setSearchTerm] = useState('SS Das');
    const [searchResults, setSearchResults] = useState([]);
    const [visibility, setVisibility] = useState({
        pswd: new Array(searchResults.length).fill(false),
        uniqId: new Array(searchResults.length).fill(false)
    });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDropDown = (key) => {
        setSearchBy(key);
        setSearchTerm('');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from(mode)
                .select('*')
                .eq(searchBy, searchTerm)

            if (error) {
                throw new Error('No results found...');
            } else if (data.length > 0) {
                setSearchResults(data);
                toast.success('Search item has been found', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            } else {
                toast.error('Found nothing', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            toast.error('not found');
        }
    };

    const handleSearchToast = (e) => {
        e.preventDefault();
        toast.promise(handleSearch(e), {
            loading: `Searching...`,
            success: `Successfully searched!`,
            error: "Failed to search.",
        });
    };

    const handleDeleteAdmin = async (id, name) => {
        try {
            const { data, error } = await supabase
                .from(mode)
                .delete()
                .eq('uniqId', id);

            if (error) {
                throw new Error(`Error deleting ${name}: ${error.message}`);
            } else {
                toast.success(`${name} deleted successfully...`);
                const newAdmins = searchResults.filter((admin) => admin.uniqId !== id);
                setSearchResults(newAdmins);
            }
        } catch (error) {
            toast.error('Error occurred during deletion');
            console.error('An unexpected error occurred:', error);
        } finally {
            onClose();
        }
    };

    const toggleVisibility = (name, e, indx) => {
        e.preventDefault();

        setVisibility(prevVisibility => ({
            ...prevVisibility,
            [name]: prevVisibility[name].map((value, i) => (i === indx ? !value : value))
        }));
    };

    const handleDeleteAdminToast = (id, name) => {
        toast.promise(handleDeleteAdmin(id, name), {
            loading: 'Deleting admin...',
            success: 'Deletion initiated...!',
            error: 'Failed to initiate deletion...'
        });
    };

    useEffect(() => {
        setVisibility({
            pswd: new Array(searchResults.length).fill(false),
            uniqId: new Array(searchResults.length).fill(false)
        });
    }, [searchResults]);

    useEffect(() => {
        setSearchResults([])
    }, [mode])

    const renderIcon = () => {
        switch(mode) {
            case 'admin':
                return <MdOutlineAdminPanelSettings className=' text-red-500'/>
            case 'teachers':
                return <FaChalkboardTeacher className=' text-green-500'/>
            default:
                return <></>
        }
    };

    return (
        <div className=' w-full flex flex-col items-cente gap-y-8 relative'>
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

            {/* Search Results */}
            <div className="w-full flex flex-col items-center justify-center gap-y-4">
                <div className="text-md text-green-500 font-onest">Search Results</div>

                <motion.div className='flex items-center justify-center flex-wrap overflow-y-auto gap-5 sm:gap-7 lg:gap-9 xl:gap-14 2xl:gap-16'
                variants={staggerVariants}
                initial='initial'
                animate='animate'>
                    {searchResults.map((result, index) => (
                        result && (
                            <motion.div 
                            key={result.uniqId + index} 
                            className="flex flex-wrap flex-col items-center justify-center p-2 bg-[#121118bb] rounded-lg group -z-0"
                            variants={childVariants}>
                                <div className='w-full flex justify-between gap-x-10 relative '>
                                    {/* Details */}
                                    <div className="space-y-2 w-full">
                                        {/* Name */}
                                        <div className="text-[1.3rem] font-bold text-[#5bffd0fb] font-onest tracking-wide line-clamp-1 flex items-center justify-between">
                                            {result.title} {result.name}
                                            
                                            <Tooltip
                                            placement='top'
                                            content={selected}
                                            color={
                                                mode === 'admin' ? "danger"
                                                : mode === 'teachers' ? "success"
                                                : "warning"
                                            }
                                            closeDelay={0}>
                                                <button variant="flat" color={'secondary'}>
                                                    {renderIcon()}
                                                </button>
                                            </Tooltip>
                                        </div>

                                        {/* Email, pswd, uniqId */}
                                        <div className="w-full bg-[#31404d] rounded-lg pr-7">
                                            <div className="text-[#20e9b0e8] flex items-center gap-x-3 font-mavenPro py-1 pl-3 w-full">
                                                <MdOutlineMailOutline className="text-xl" /> {result.emailId}
                                            </div>

                                            <div className="text-[#20e9b0e8] flex items-center gap-x-3 font-mavenPro py-1 pl-3 w-full">
                                                <button className="text-xl" onClick={(e) => toggleVisibility('pswd', e, index)}>
                                                    {visibility.pswd[index] ? <MdOutlineLockOpen /> : <MdOutlineLock />}
                                                </button>

                                                <input 
                                                    type={visibility.pswd[index] ? "text" : "password"}
                                                    className="outline-none bg-transparent w-full text-[#20e9b0e8] font-mavenPro"
                                                    value={result.password}
                                                    disabled
                                                />
                                            </div>                                    
                                            
                                            <div className="text-[#20e9b0e8] flex items-center gap-x-3 font-mavenPro py-1 pl-3 w-full">
                                                <button className="text-xl" onClick={(e) => toggleVisibility('uniqId', e, index)}>
                                                    {visibility.uniqId[index] ? <TbLockAccess /> : <TbLockAccessOff />}
                                                </button>

                                                <input 
                                                    type={visibility.uniqId[index] ? "text" : "password"}
                                                    className="outline-none bg-transparent w-full text-[#20e9b0e8] font-mavenPro"
                                                    value={result.uniqId  || result.usnId}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logo */}
                                    <div className="mt-1 min-w-14 max-w-14 min-h-14 max-h-14 bg-[#c993ff] shadow-md shadow-orange-500 font-bold text-violet-800 rounded-full overflow-hidden flex items-center justify-center mr-1">
                                        {nameLogo(result.name)}
                                    </div>
                                    
                                    {/* Delete Button */}
                                    <button className="absolute right-4 bottom-3 text-red-500 text-xl hidden group-hover:block" onClick={() => onOpen()}>
                                        <FiTrash2 className="rounded-full" />
                                    </button>

                                    {/* Delete Confirmation Modal */}
                                    <Modal
                                    backdrop="transparent"
                                    isOpen={isOpen}
                                    onClose={onClose}>
                                        <ModalContent>
                                            <ModalHeader className="flex flex-col gap-1 text-lg font-mavenPro">
                                                Deletion confirmation
                                            </ModalHeader>

                                            <ModalBody className="text-xl font-onest">
                                                You want to remove {result.name}?
                                            </ModalBody>

                                            <ModalFooter className="mt-3 flex justify-between">
                                                <Button color="danger" variant="flat" onPress={onClose}>
                                                    Close
                                                </Button>

                                                <Button className="bg-cyan-200 text-cyan-800" 
                                                onClick={() => handleDeleteAdminToast(result.uniqId, result.name)}
                                                    onPress={() => handleDeleteMiddleware(index)}>
                                                    Delete
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </div>
                                
                                {(result.MCA || result.MSc) && (
                                    <RenderDeptClass data={result}/>
                                )}
                            </motion.div>
                        )
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SearchAdmin;
