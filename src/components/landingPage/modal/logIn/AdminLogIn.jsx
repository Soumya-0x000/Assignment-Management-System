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
import { supabase } from "../../../../CreateClient";
import { MailIcon } from "../../icons/MailIcon";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";

export default function AdminLogIn() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [adminLoginData, setAdminLoginData] = useState({
        email: '',
        password: ''
    });
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [detailsMatched, setDetailsMatched] = useState(false)
    const [sessionVal, setSessionVal] = useState({})

    const {
        adminIsAuthenticated
    } = useSelector(state => state.adminAuth)
    const dispatch = useDispatch();

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
                setDetailsMatched(true)
            } else {
                console.error(adminStatusError?.message)
                alert('No account found with this email address!');
                setDetailsMatched(false)
            }
        } catch (error) {
            console.error(error.message)
        }
    };

    const handleMagicLink = async (e) => {
        if (detailsMatched) {      
            try {
                const { data, error } = await supabase.auth.signInWithOtp({
                    email: adminLoginData.email,
                    options: {
                        shouldCreateUser: false,
                        emailRedirectTo: `${window.location.origin} ${adminIsAuthenticated ? '/admindashboard' : '/'}`,
                    }
                });
                
                if (error) throw new Error(error.message);
                
                if (data.user === null && data.session === null) alert(`Check your ${adminLoginData.email} mailbox`);

                supabase.auth.onAuthStateChange((_, session) => (
                    console.log(session),
                    setSessionVal(session)
                ))
            } catch (error) {
                console.error('Error occurred in signing in');
            }
        } else {
            alert("The provided details do not match our records.")
        }
    };

    console.log(sessionVal);
    
    useEffect(() => {
        setAdminLoginData(adminLoginData)
    }, [adminLoginData]);

    return (
        <>
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
                            onClick={handleCheckStatus}>
                                Check Status
                            </Button>
                        </div>
                    </ModalBody>
                            
                    <ModalFooter className=" mt-6 flex items-center justify-between">
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>

                        <Button className="bg-[#c2f0ff] text-cyan-800" variant="flat"
                        onClick={handleMagicLink}>
                            Send Link
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
