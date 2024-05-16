import { motion } from "framer-motion";

const SlidingTabs = ({
    tabs,
    selected,
    setSelected,
}) => {
    return (
        <div className=" py-2 sm:py-3 bg-slate-900 rounded-md flex items-center justify-between px-2 sm:justify-evenly flex-wrap gap-2">
            {tabs.map((tab, indx) => (
                <Chip
                    text={tab}
                    selected={selected === tab}
                    setSelected={setSelected}
                    key={tab + indx}
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
        } lg:text-lg font-onest transition-colors px-6 sm:px-4 py-1 rounded-lg relative`}>
            <span className="relative z-10 ">{text}</span>
            {selected && (
                <motion.span
                    layoutId="pill-tab"
                    className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg"
                    transition={{ type: "spring", duration: 0.5 }}
                />
            )}
        </button>
    );
};

export default SlidingTabs;