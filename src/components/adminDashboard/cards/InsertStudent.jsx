export const InsertStudent = () => {
    return ( 
        <div>
            <Input
                autoFocus
                endContent={<BsPersonLinesFill className="text-[1.4rem] text-default-400 pointer-events-none flex-shrink-0" />}
                label="Name"
                type='text'
                name="name"
                value={commonAttributes.name}
                onChange={handleChange}
                required
                variant="bordered"
            />

            <Input
                endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                label="Email"
                type='email'
                name="email"
                value={commonAttributes.email}
                onChange={handleChange}
                required
                variant="bordered"
            />

            <Input
                label="Password"
                name="password"
                variant="bordered"
                min={8}
                value={commonAttributes.password}
                onChange={handleChange}
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

            <Input
                endContent={<MdAdminPanelSettings className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                label="USN ID"
                type='text'
                name="usnId"
                value={studentRegisterData.usnId}
                onChange={handleChange}
                variant="bordered"
                required
            />

            <Input
                label="Date of Birth"
                type='date'
                name="dateOfBirth"
                value={studentRegisterData.dateOfBirth}
                onChange={handleChange}
                required
                variant="bordered"
            />
            
            <Dropdown>
                <DropdownTrigger>
                    <Button 
                    endContent={<SiGoogleclassroom className="text-[1.25rem] text-default-400 pointer-events-none flex-shrink-0" />}
                    className={`h-14 border-gray-200 rounded-xl py-3 pl-2.5 pr-3 ${studentRegisterData.dept ? 'text-black' : 'text-gray-500'} text-[14px] active:border-gray-200 outline-none active:outline-none hover:border-gray-400 flex items-end justify-between`}
                    variant="bordered">
                        {studentRegisterData.dept ? studentRegisterData.dept : 'Select Department'}
                    </Button>
                </DropdownTrigger>

                <DropdownMenu aria-label="Static Actions"
                onAction={(key) => handleDropDown('dept', key)}>
                    <DropdownItem key={'MCA'}>MCA</DropdownItem>
                    <DropdownItem key={'MSc'}>MSc</DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Dropdown>
                <DropdownTrigger>
                    <Button 
                    endContent={<TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                    className={`h-14 border-gray-200 rounded-xl py-3 pl-2.5 pr-3 ${studentRegisterData.semester ? 'text-black' : 'text-gray-500'} text-[14px] active:border-gray-200 outline-none active:outline-none hover:border-gray-400 flex items-end justify-between`}
                    variant="bordered">
                        {studentRegisterData.semester ? formatSemester(studentRegisterData.semester) : 'Select semester'}
                    </Button>
                </DropdownTrigger>

                <DropdownMenu aria-label="Static Actions"
                onAction={(key) => handleDropDown('semester', key)}>
                    <DropdownItem key={'1'}>1st semester</DropdownItem>
                    <DropdownItem key={'2'}>2nd semester</DropdownItem>
                    <DropdownItem key={'3'}>3rd semester</DropdownItem>
                    <DropdownItem key={'4'}>4th semester</DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <div>
                <Button color="danger" variant="flat" onClick={onClose}>
                    Close
                </Button>

                <Button className="bg-green-200 text-green-800" onClick={(e) => handleRegister(e)}>
                    Register
                </Button>
            </div>
        </div>
    )
};