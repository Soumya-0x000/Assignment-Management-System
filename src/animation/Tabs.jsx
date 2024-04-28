import { motion } from "framer-motion";
import { useState } from "react";

const ChipTabs = ({ 
    tabsArr,
    selected,
    setSelected
}) => {
    return (
        <div className=" py-2 sm:py-3 bg-slate-900 rounded-md flex items-center justify-evenly flex-wrap gap-2">
            {tabsArr.map((tab, indx) => (
                <Chip
                    text={tab.name}
                    selected={selected === tab.name}
                    setSelected={setSelected}
                    key={tab.name+indx}
                />
            ))}
        </div>
    );
};

const Chip = ({
    text,
    selected,
    setSelected,
}) => {
    return (
        <button
        onClick={() => setSelected(text)}
        className={`${
            selected
            ? "text-white"
            : "text-slate-300 hover:text-slate-200 hover:bg-slate-700"
        } text-sm transition-colors px-5 py-1.5 rounded-md relative`}>
            <span className="relative z-10 text-[15px] sm:text-[18px] font-robotoMono">{text}</span>
            {selected && (
                <motion.span
                    layoutId="pill-tab"
                    className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md"
                    transition={{ type: "spring", duration: 0.5 }}
                ></motion.span>
            )}
        </button>
    );
};

export default ChipTabs;