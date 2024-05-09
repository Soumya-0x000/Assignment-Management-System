import React, { useEffect, useState } from "react";
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    useDisclosure, 
    Checkbox, 
    Input, 
    Link
} from "@nextui-org/react";
import { supabase } from "../../../CreateClient";
import { MailIcon } from "../icons/MailIcon";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { setAdminAuthentication, setSession } from "../../../reduxStore/reducers/AdminAuthSlice";

export default function AdminLogIn() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [adminLoginData, setAdminLoginData] = useState({
        email: '',
        password: ''
    });
    const [isVisible, setIsVisible] = useState(false);
    const [detailsMatched, setDetailsMatched] = useState(false)
    const [sessionVal, setSessionVal] = useState({})
    const toggleVisibility = () => setIsVisible(!isVisible);

    const {
        session: adminSession,
        adminIsAuthenticated
    } = useSelector(state => state.adminAuth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const router = useLocation();
    // console.log(router)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCheckStatus = async () => {
        try {
            const {data: adminStatusData, error: adminStatusError} = await supabase
                .from('admin')
                .select("*")
                .eq('emailId', adminLoginData.email)
                .eq('password', adminLoginData.password)
            
            if (!adminStatusError && adminStatusData?.length > 0){
                setDetailsMatched(true);

                toast((t) => (
                    <span>
                        Click
                        <span className="text-cyan-400 mx-2 font-bold">
                            Send Link
                        </span>
                        below to proceed
                    </span>
                ), 
                {
                    icon: '😎',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            } else {
                console.error(adminStatusError?.message)
                toast('You are not an authorized admin!', {
                    icon: '😑',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                setDetailsMatched(false)
            }
        } catch (error) {
            console.error(error.message)
            toast('Error occurred in fetching data', {
                icon: '😥',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    };

    const handleAdminStatusToast = () => {
        if (adminLoginData.email.trim() && adminLoginData.password.trim()) {
            toast.promise(handleCheckStatus(), {
                loading: 'Loading',
                success: 'Response received',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        } else {
            toast('Fill up the form 🥸', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const handleMagicLink = async (e) => {
        if (detailsMatched) {      
            try {
                const { data, error } = await supabase.auth.signInWithOtp({
                    email: adminLoginData.email,
                    options: {
                        shouldCreateUser: false,
                    }
                });
                
                if (error) throw new Error(error.message);
                console.log(data)
                if (data.user === null && data.session === null) {
                    toast('Check your mailbox', {
                        icon: '📨',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }

                // const setSessionVal = async () => {
                //     const {data: {session}, error} = await supabase.auth.getSession();
                //     if (error) throw error;
                //     if(session?.user?.role === 'authenticated') { 
                //         dispatch(setAdminAuthentication(true));
                //         navigate(`/admindashboard`)
                //     }
                // };

                supabase.auth.onAuthStateChange((_, session) => {
                    console.log(session),
                    console.log(session?.user?.role),
                    setSessionVal(session),
                    session?.user?.role === 'authenticated' && dispatch(setAdminAuthentication(true))
                    navigate('/admindashboard')
                })
                // setSessionVal();
                
                } catch (error) {
                    console.error('Error occurred in signing in', error);
                    toast.error('Error occurred in signing in');
                }
            }
        };
        
    const handleMagicLinkToast = () => {
        if (detailsMatched) {
            toast.promise(handleMagicLink(), {
                loading: 'Loading',
                success: 'Response received',
            });
        } else {
            toast("Check your status first", {
                icon: '😐',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        }
    };
    
    useEffect(() => {
        setAdminLoginData(adminLoginData)
    }, [adminLoginData]);

    return (
        <>
            <Toaster/>

            <Button onPress={onOpen} className="bg-gray-900 font-bold font-oxanium tracking-wider text-green-300 sm:text-[17px] text-left rounded-md">
                Admin
            </Button>

            <Modal 
            backdrop="blur"
            isOpen={isOpen} 
            onOpenChange={onClose}
            className="border-[1px] border-slate-300 absolute top-1/2 -translate-y-1/2"
            placement="top-center"
            onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-xl mb-5">
                        Log in as Admin
                    </ModalHeader>

                    <ModalBody>
                        <div className=" flex flex-col gap-y-3">
                            <Input
                                autoFocus
                                value={adminLoginData.email}
                                type="email"
                                onChange={handleChange}
                                endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                label="Email"
                                variant="bordered"
                                name='email'
                                required
                            />

                            <Input
                                label="Password"
                                name="password"
                                variant="bordered"
                                min={8}
                                value={adminLoginData.password}
                                onChange={handleChange}
                                required
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <BiSolidLockOpen className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <BiSolidLock className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                    </button>
                                }
                                type={isVisible ? "text" : "password"}
                            />
                            
                            <Button className="bg-[#dbffba] text-[#568927] border-[1px] border-[#81ffa3]" 
                            variant="flat"
                            onClick={handleAdminStatusToast}>
                                Check Status
                            </Button>
                        </div>
                    </ModalBody>
                            
                    <ModalFooter className=" mt-6 flex items-center justify-between">
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>

                        <Button className="bg-[#c2f0ff] text-cyan-800" variant="flat"
                        onClick={handleMagicLinkToast}>
                            Send Link
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
