import { useState } from 'react';
import { FaPlus, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddDocument = () => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/create-document'); // Navigate to the create-document page
    }

    return (
        <div
            onClick={handleClick}
            className="fixed bottom-5 right-5 newShadow border size-[56px] rounded-full flex center cursor-pointer"
        >
            <div
                className="relative w-12 h-12 flex items-center justify-center"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div
                    className={`absolute transition-transform duration-200 ease-in-out ${
                        hovered ? 'opacity-0 rotate-[120deg]' : 'opacity-100 rotate-0'
                    }`}
                >
                    <FaPlus className="text-xl text-blue-600" />
                </div>
                <div
                    className={`absolute transition-transform duration-200 ease-in-out ${
                        hovered ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-[120deg]'
                    }`}
                >
                    <FaPencilAlt className="text-xl text-blue-600" />
                </div>
            </div>
        </div>
    );
};

export default AddDocument;
