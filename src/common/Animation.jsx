export const staggerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export const childVariants = {
    initial: { opacity: 0, y: 200, },
    animate: { opacity: 1, y: 0,  transition: {duration: .3}},
};