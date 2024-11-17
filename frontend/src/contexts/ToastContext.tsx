import React, { createContext, useState } from 'react';
import Toast from '../components/Toast';

interface IToast {
    open: (message: string) => void;
    close: (id: string) => void;
}

const defaultValue = {
    open: () => {},
    close: () => {},
} as IToast;

export const ToastContext = createContext<IToast>(defaultValue);

type ToastProviderProps = {
    children: React.ReactNode;
};

type MessageType = {
    message: string;
    id: string;
};


const ToastProvider = ({ children }: ToastProviderProps) => {
    const [messages, setMessages] = useState<MessageType[]>([]);

    const open = (msg: string) => {
        if (!msg.trim()) return; // Prevent empty messages

        const newToast: MessageType = {
            id: "", // Use current timestamp as a unique ID
            message: msg,
        };

        setMessages((previousToasts) => [...previousToasts, newToast]);
    };

    const close = (id: string) => {
        setMessages((previousToasts) => previousToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ open, close }}>
            {children}
            <div className="fixed bottom-1 right-1">
                {messages.map((msg) => (
                    <Toast key={msg.id} message={msg.message} close={() => close(msg.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
