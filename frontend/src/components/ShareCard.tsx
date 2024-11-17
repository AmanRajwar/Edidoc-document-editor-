import { useRef, useState } from 'react';
import apiClient from '../lib/apiClient';
import Dropdown from './Dropdown';
import useClickOutside from '../hooks/useClickOutside';
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import { openToast } from '../redux/features/ToastSlice';
import { ADD_COLLABORATOR } from '../utils/constants';


type DropdownOptions = 'editor' | 'viewer';
type ShareCardProps = {
    setShare: () => void
};
const ShareCard: React.FC<ShareCardProps> = ({ setShare }) => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>('')
    const shareCardRef = useRef<HTMLDivElement>(null);
    const dropdownOptions: DropdownOptions[] = ['viewer', 'editor'];
    const [selectedOption, setSelectedOption] = useState<DropdownOptions>('viewer');
    const { user } = useAppSelector((state: RootState) => state.user);
    const openedDocument = useAppSelector((state: RootState) => state.documents.openedDocument)

    useClickOutside(shareCardRef, setShare)

    const handleAddCollaborator = async () => {
        try {
            if (!openedDocument) {
                dispatch(openToast("First save the document"))
                return;
            }
            if (email.length === 0 || selectedOption.length === 0) {
                dispatch(openToast("Add full details"))
                return;
            }
            const docId = openedDocument.document._id;
            const response = await apiClient.post(`${ADD_COLLABORATOR}/${docId}`,
                { role: selectedOption, email: email },
                { withCredentials: true })
            console.log('collaborators => ', response)
            
            if (response.data.success) {
                dispatch(openToast("Collaborator added successfully"))
                setEmail('');
                setShare()
            }

        } catch (error: any) {
            console.log(error);
            dispatch(openToast(error.response.data.message))
        }
    }

    return (
        <div className='w-full h-full bg-slate-600 bg-opacity-70 fixed top-0 z-10 flex center '>
            {/* Header */}
            <div ref={shareCardRef} className="w-[500px] p-4 border border-gray-300 rounded-lg bg-white shadow-lg ">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Share document : {openedDocument.document.name}</h3>
                    {/* <button className="text-gray-500 hover:text-gray-700">
                        ⚙️
                    </button> */}
                </div>

                {/* Add People Input */}
                <div className=' flex gap-4 mb-4'>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Add people, groups and calendar events"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:border-2"
                    />
                    <Dropdown options={dropdownOptions}
                        selectedOption={selectedOption}
                        onOptionSelect={(option) => setSelectedOption(option)}
                        containerClassName=' border flex center rounded-md'
                    />
                </div>


                {/* People with Access */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium">People with access</h4>
                    <div className="flex items-center mt-2">
                        <img
                            src="https://via.placeholder.com/32"
                            alt="Profile"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                            <p className="font-semibold">{openedDocument.document.owner.firstName} {openedDocument.document.owner.lastName} {user && openedDocument.document.owner._id.toString() === user.id ? '(you)' : ''} </p>
                            <p className="text-xs text-gray-500">{openedDocument.document.owner.email}</p>
                        </div>
                        <span className="ml-auto text-xs text-gray-500">Owner</span>
                    </div>
                </div>

                {/* General Access */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium">General access</h4>
                    <div className="flex flex-col mt-2">
                        <span className="font-semibold">Restricted</span>
                        <span className="text-xs text-gray-500">
                            Only people with access can open with the link
                        </span>
                    </div>

                </div>

                {/* Done Button */}
                <button onClick={handleAddCollaborator} className="w-full p-2 bg-blue-600 text-white rounded-md font-semibold">
                    Share
                </button>
            </div>

        </div>
    );
};

export default ShareCard;
