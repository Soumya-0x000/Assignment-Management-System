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

export default function AdminLogIn() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [adminLoginData, setAdminLoginData] = useState({
        email: '',
        otp: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleMagicLink = async (e) => {        
        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                email: adminLoginData.email,
                options: {
                    shouldCreateUser: false,
                    emailRedirectTo: `${window.location.origin}/admindashboard`,
                }
            });
            
            if (error) {
                throw new Error(error.message);
            }
            
            if (data.user === null && data.session === null) {
                alert(`Check your ${adminLoginData.email} mailbox`);
            }
        } catch (error) {
            console.error('Error occurred in signing in');
        }
    };
    

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
                        <div className=" flex items-center justify-between gap-x-3">
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

                            <Button  className="bg-[#c2f0ff] text-cyan-800" variant="flat"
                            onClick={handleMagicLink}>
                                Send Link
                            </Button>
                        </div>
                    </ModalBody>

                    <ModalFooter className=" mt-6 flex items-center justify-between">
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
