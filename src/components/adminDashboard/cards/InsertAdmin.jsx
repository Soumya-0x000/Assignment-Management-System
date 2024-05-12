import { useState } from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { MailIcon } from "../../landingPage/icons/MailIcon";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import { supabase } from "../../../CreateClient";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";

export const InsertAdmin = () => {
    const [commonAttributes, setCommonAttributes] = useState({
        name: "", 
        email:"", 
        password: "",
    });
    const [isVisible, setIsVisible] = useState(false);
    const inputFields = [
        { label: 'Name', name: 'name', type: 'text', icon: <BsPersonLinesFill /> },
        { label: 'Email', name: 'email', type: 'email', icon: <MailIcon /> },
        { label: 'Password', name: 'password', type: 'password', icon: isVisible ? <BiSolidLockOpen /> : <BiSolidLock /> }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCommonAttributes({
            ...commonAttributes,
            [name]: value
        });
    };

    const handleReset = () => {
        setCommonAttributes({
            name: "",
            email: "",
            password: ""
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('admin')
                .insert({ name: commonAttributes.name, emailId: commonAttributes.email, password: commonAttributes.password })

            if (error) {
                toast.error(`Can't insert`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            } else {
                toast.success(`Successfully inserted ${commonAttributes.name} as Admin`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
                handleReset()
            }
        } catch (error) {
            console.error(error.message);
            toast.error('Error occurred during inserting...')
        }
    };

    const handleSubmitToast = (e) => {
        if (
            commonAttributes.name.trim().length > 4 &&
            commonAttributes.email.trim().length > 6 &&
            commonAttributes.email.includes('@') &&
            commonAttributes.password.trim().length >= 6
        ) {
            toast.promise(handleSubmit(e), {
                loading: 'Insertion process started...',
                success: 'Successfully inserted!',
                error: 'Failed to insert.',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        } else toast('Fill up all required fields...', {
            icon: '⚠️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        })
    };

    return (
        <form className=' w-full space-y-8'>
            <div className=' w-full flex flex-col items-center gap-y-8'>
                {inputFields.map((field, index) => (
                    <div key={index} className='relative w-full transition-all'>
                        <input
                            autoFocus={index === 0}
                            type={field.name === 'password' ? isVisible ? 'text' : 'password' : field.type}
                            name={field.name}
                            id={field.name}
                            className={`border-2 rounded-xl pl-4 pr-12 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${commonAttributes[field.name] ? 'border-green-500' : ''} focus:border-green-500 focus:placeholder:-translate-x-7 transition-all peer`}
                            value={commonAttributes[field.name]}
                            onChange={handleChange}
                            min={field.name === 'password' ? 6 : 3}
                            max={field.name === 'password' ? 16 : undefined}
                            required={true}
                        />

                        <label
                        htmlFor={field.name}
                        className={`text-md text-green-400 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${commonAttributes[field.name] ? '-translate-y-[3.1rem] translate-x-[.5rem] text-sm' : ''} peer-focus:-translate-y-[3.1rem] peer-focus:translate-x-[.5rem] peer-focus:text-sm transition-all`}>
                            {field.label}
                        </label>

                        <div className={`${field.name === 'password' && 'cursor-pointer hover:scale-110 active:scale-90'} text-2xl text-default-400 absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-lg transition-all`}
                        onClick={() => field.name === 'password' && setIsVisible(!isVisible)}>
                            {field.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* buttons */}
            <div className=' w-full flex justify-between'>
                <Button className=" font-onest text-md tracking-wide"
                color='danger'
                onClick={handleReset}>
                    Reset
                </Button>

                <Button 
                type='submit'
                className="bg-[#23fda2ed] text-green-800 font-bold font-onest text-md tracking-wide"
                onClick={(e) => handleSubmitToast(e)}>
                    Submit
                </Button>
            </div>
        </form>
    );
};