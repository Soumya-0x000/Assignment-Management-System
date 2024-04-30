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
import { LockIcon } from "../../icons/LockIcon";
import { supabase } from "../../../../CreateClient";
import { useNavigate } from "react-router-dom";
import { TbListNumbers } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";

export default function StudentLogIn({ userType }) {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [studentLoginData, setStudentLoginData] = useState({
        usnId: '',
        semester: '',
        dept: '',
    });
    const [tableName, setTableName] = useState('studentsSem');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target
        setStudentLoginData({
            ...studentLoginData,
            [name]: value
        })

    };

    const handleLogin = async () => {
        try {
            const { data: tableData, error: tableError } = await supabase
                .from('studentsTableName')
                .select('*')
                .eq('tableName', tableName)
                .single();
    
            if (tableError) {
                console.error('Error querying studentsTableName:', tableError.message);
                return;
            }
    
            if (!tableData) {
                console.error('No table data found for:', tableName);
                return;
            }
    
            const { data: studentData, error: studentError } = await supabase
                .from(tableName)
                .select('*')
                .eq('semester', studentLoginData.semester)
                .eq('department', studentLoginData.dept.toLowerCase())
                .eq('usnId', studentLoginData.usnId)
                .single();
    
            if (!studentData) {
                alert(`No ${userType} found with USN ID ${studentLoginData.usnId} in semester ${studentLoginData.semester} in ${studentLoginData.dept} department`);
                return;
            } else {   
                console.log(studentData);
                setStudentLoginData({ usnId: '', semester: '', dept: '' });
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    
        onClose();
    };
    

    useEffect(() => {
        setTableName(prevTableName => 'studentsSem' + studentLoginData.semester);
    }, [studentLoginData.semester]);

    return (
        <>
            <Button onPress={onOpen} className=" bg-gray-900 font-bold font-oxanium tracking-wider text-green-300 sm:text-[17px] text-left rounded-md">
                Student
            </Button>

            <Modal 
            backdrop="blur"
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            className=" border-[1px] border-slate-300 absolute top-1/2 -translate-y-1/2"
            placement="top-center"
            onClose={onClose}>
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-xl mb-2">
                            Log in as Student
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                autoFocus
                                value={studentLoginData.usnId}
                                type="text"
                                onChange={handleChange}
                                endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                label="USN ID"
                                variant="bordered"
                                name='usnId'
                                required
                            />

                            <Input 
                                endContent={<TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                label="Semester"
                                min={1}
                                max={4}
                                type='number'
                                name="semester"
                                value={studentLoginData.semester}
                                onChange={handleChange}
                                required
                                variant="bordered"
                            />
                            
                            <Input 
                                endContent={<SiGoogleclassroom className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                label="Department"
                                type='text'
                                name="dept"
                                value={studentLoginData.dept}
                                onChange={handleChange}
                                required
                                variant="bordered"
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

                        <ModalFooter className=" mt-5">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>

                            <Button className=" bg-cyan-200 text-cyan-800" onPress={handleLogin}>
                                Sign in
                            </Button>
                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    );
};
