import React from "react";
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
import { LockIcon } from "../icons/LockIcon";


export default function StudentModal({ name }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Button onPress={onOpen} className=" bg-gray-900 font-bold font-robotoMono text-green-300 text-[17px] text-left rounded-md">
                Student
            </Button>

            <Modal 
            backdrop="blur"
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            className=" border-[1px] border-slate-300 absolute top-1/2 -translate-y-1/2"
            placement="top-center">
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-xl mb-2">
                            Log in as Student
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                autoFocus
                                endContent={
                                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                                className=""
                                label="USN id"
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

                            <Button className=" bg-cyan-200 text-cyan-800" onPress={onClose}>
                                Sign in
                            </Button>
                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    );
}
