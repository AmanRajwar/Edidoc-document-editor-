import React, { useEffect, useState } from 'react';

type ToastProps = {
    key: string,
    message: string,
    close: (id: string) => void
}

const Toast = ({ key, message, close }: ToastProps) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [key]);

    // Function to handle close with animation
    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            close(key);
        }, 450);
    };


    
    return (
        <div key={key}
            className={` z-50 flex gap-5 px-4 py-2 bg-red-200 rounded-md border-red-300 border-[1px] shadow-xl mb-1 
            ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}
        >
            <p className='text-black text-[17px]'>{message}</p>
            <button onClick={handleClose}>X</button>
        </div>
    );
}

export default Toast;
