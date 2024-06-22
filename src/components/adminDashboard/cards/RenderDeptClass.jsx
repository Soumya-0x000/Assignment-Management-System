export const RenderDeptClass = ({data}) => {
    const department = ['MCA', 'MSc'];

    return ( 
        <>
            {department.map((val, i) => (
                <div className=' mt-5 w-full'
                key={val+i}>
                    <div className='pb-1 mb-2 w-full border-b-1 border-yellow-200 '>
                        <p className='text-[1.1rem] font-bold text-[#5bffd0fb] font-onest tracking-wide'>
                            {val}
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3'>
                        {data[val].length > 0 ? data[val]
                        .filter(sub => Object.entries(sub).length > 0)
                        .sort((a, b) => {
                            const keyA = Object.keys(a)[0];
                            const keyB = Object.keys(b)[0];
                            return keyA.localeCompare(keyB)
                        })
                        .map((sub, i) => (<>
                            {Object.values(sub).filter(Boolean).length > 0 && (
                                <div className=' flex items-center flex-wrap gap-x-2 rounded-lg p-2 bg-[#1e5341] text-[#9fffcfe8] text-[.9rem] font-onest tracking-wide font-bold w-full h-fit'
                                key={i}>
                                    <span>{Object.entries(sub)[0][0]}:</span>
                                    <span>{Object.entries(sub)[0][1]}</span>
                                </div>
                            )}
                        </>)) : (
                            <div className=' col-span-4 flex items-center justify-center rounded-lg p-2 bg-[#3746b8] text-[#ffffa3e8] text-[.9rem] font-robotoMono font-bold min-w-[25rem] max-w-[25rem]'>No {val} classes...</div>
                        )}
                    </div>
                </div>
            ))}
        </>
    )
}
