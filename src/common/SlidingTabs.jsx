import { motion } from "framer-motion";
import { useState } from "react";

const SlidingTabs = ({
    tabs,
    selected,
    setSelected,
}) => {
    return (
        <div className=" w-fit flex items-center justify-between flex-wrap gap-x-10 sm:gap-x-2 md:gap-x-4 lg:gap-x-5">
            {tabs.map((tab) => (
                <Chip
                    text={tab}
                    selected={selected === tab}
                    setSelected={setSelected}
                    key={tab}
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
        } lg:text-lg font-onest transition-colors px-4 py-1 rounded-md relative`}>
            <span className="relative z-10 ">{text}</span>
            {selected && (
                <motion.span
                    layoutId="pill-tab"
                    className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md"
                    transition={{ type: "spring", duration: 0.5 }}
                />
            )}
        </button>
    );
};

export default SlidingTabs;