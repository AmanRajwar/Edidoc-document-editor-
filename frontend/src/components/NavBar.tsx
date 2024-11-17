import {  useState } from 'react'
import ShareCard from './ShareCard'
import { openToast } from '../redux/features/ToastSlice';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import ProfileDropdown from './ProfileDropdown';

interface IProps {
    search?: boolean,
    share?: boolean
}

const NavBar = ({ search, share }: IProps) => {

    const dispatch = useAppDispatch();

    const [openShare, setOpenShare] = useState<boolean>();
    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
    const openedDocument = useAppSelector((state: RootState) => state.documents.openedDocument)

    const handleShare = () => {
        if (Object.keys(openedDocument).length === 0 && openedDocument.constructor === Object) {
            dispatch(openToast("First save the document"))
            return;
        }
        setOpenShare(!openShare);
    }


    return (
        <>
            {openShare && <ShareCard setShare={() => setOpenShare(false)} />}
            <header className='z-0'>

                <div className='flex w-full justify-between items-center px-8 my-2'>
                    <div className='logo flex center'>
                        <img src='images/google-docs.png' className='size-9 mr-3 '/>
                        <h1 className='text-[22px] font-bold tracking-wider font-alata text-slate-800'> EDIDOC</h1>
                    </div>

                    {search && <div className=''>
                        <div className=' flex px-2 items-center justify-center rounded-full h-12 w-[600px]  bg-slate-100 border  focus-within:bg-white focus-within:shadow-md' >
                            <input type="text" placeholder='Search' className='ml-4 bg-transparent w-full h-5   focus:outline-none placeholder:text-slate-400 placeholder:text-[20px] text-[20px]' />
                            <div className='  mr-[1px] ml-4  rounded-full hover:bg-slate-300 size-9 p-2 flex center'>
                                <img className='object-contain size-6' src='/images/search.png' alt='document image' />
                            </div>
                        </div>
                    </div>}

                    <div className='flex  gap-7 share-butoon'>
                        {
                            share &&
                            <button onClick={handleShare} className=' flex center border px-6 rounded-full bg-blue-200  hover:bg-blue-300 hover:shadow hover:shadow-blue-1'>
                                <p className=' text-[18px] align-middle text-center items-center' >Share</p>
                            </button>
                        }
                        <div
                            className="relative"
                            onMouseEnter={() => setShowProfileMenu(true)}
                            onMouseLeave={() => setShowProfileMenu(false)}
                        >
                            <button className="profile rounded-full h-[40px] w-10 hover:bg-blue-300  hover:shadow hover:shadow-blue-200 flex center">
                                <img
                                    className="object-cover absolute h-[38px] w-[38px]"
                                    src="/images/user.png"
                                    alt="document image"
                                />
                            </button>

                            {showProfileMenu && (
                                <ProfileDropdown />
                                // <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-4 z-10">
                                //     <p className="text-center font-medium text-gray-800">Aman Rajwar</p>
                                //     <hr className="my-2 border-gray-200" />
                                //     <button className="block w-full text-left px-2 py-1 text-gray-600 hover:bg-gray-100 rounded">
                                //         Settings
                                //     </button>
                                //     <button className="block w-full text-left px-2 py-1 text-gray-600 hover:bg-gray-100 rounded">
                                //         Sign Out
                                //     </button>
                                // </div>
                            )}
                        </div>
                    </div>
                </div>

            </header>
        </>

    )
}

export default NavBar