import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { MailIcon } from "../../icons/MailIcon";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";

export default function AdminLogIn() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [adminLoginData, setAdminLoginData] = useState({
        email: '',
        authCode: ''
    });
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminLoginData({
            ...adminLoginData,
            [name]: value
        });
    };

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase
                .from('admin')
                .select('*')
                .eq('emailId', adminLoginData.email)
                .eq('authCode', adminLoginData.authCode)
                .single();

            if (error) {
                console.error('Error querying database:', error.message);
                alert(`No admin found with the provided credentials.`);
                return;
            } else {
                setAdminLoginData({
                    email: '',
                    authCode: ''
                });
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
            alert('An unexpected error occurred. Please try again.');
        }
        onClose();
    };

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
                            value={adminLoginData.authCode}
                            onChange={handleChange}
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
                            label="Authentication code"
                            variant="bordered"
                            name='authCode'
                            required
                        />

                        <div className="flex py-2 px-1 justify-between">
                            <Checkbox classNames={{ label: "text-small" }}>
                                Remember me
                            </Checkbox>

                            <Link color="primary" href="#" size="sm">
                                Forgot password?
                            </Link>
                        </div>
                    </ModalBody>

                    <ModalFooter className=" mt-10">
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>

                        <Button className="bg-cyan-200 text-cyan-800" onPress={handleLogin}>
                            Sign in
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
