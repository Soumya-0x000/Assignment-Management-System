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
import { MailIcon } from "../../icons/MailIcon";
import { supabase } from "../../../../CreateClient";
import { useNavigate } from "react-router-dom";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";

export default function TeacherLogIn() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [teacherLoginData, setTeacherLoginData] = useState({
        email: '',
        password: ''
    });
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherLoginData({
            ...teacherLoginData,
            [name]: value
        });
    };

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .eq('emailId', teacherLoginData.email)
                .eq('password', teacherLoginData.password)
                .single();

            if (error) {
                console.error('Error querying database:', error.message);
                alert(`No teacher found with the provided credentials.`);
                return;
            } else {
                setTeacherLoginData({
                    email: '',
                    password: ''
                })
            }
            console.log('Teacher data:', data);
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
            alert('An unexpected error occurred. Please try again.');
        }
        onClose();
    };

    return (
        <>
            <Button onPress={onOpen} className="bg-gray-900 font-bold font-oxanium tracking-wider text-green-300 sm:text-[17px] text-left rounded-md">
                Teacher
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
                        Log in as Teacher
                    </ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            value={teacherLoginData.email}
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
                            value={teacherLoginData.password}
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
};
