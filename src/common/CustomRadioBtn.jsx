import { Radio, cn } from "@nextui-org/react";

export const CustomRadio = (props) => {
    const {children, ...otherProps} = props;
  
    return (
        <Radio
        {...otherProps}
        classNames={{
            base: cn(
                "inline-flex m-0 bg-slate-900 hover:bg-gray-950 items-center justify-between",
                "flex-row-reverse w-fit cursor-pointer rounded-lg gap-4 pl-1 py-1.5 pr-2 border-2 border-transparent",
                "data-[selected=true]:border-primary"
            ),
        }}>
            <span className=' text-blue-200 font-montserrat text-[13px]'>
                {children}
            </span>
        </Radio>
    );
};