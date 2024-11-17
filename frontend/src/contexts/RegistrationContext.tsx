// ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context value
export interface IRegistration {
    openRegistration: boolean;
    // setOpenRegistration: (openRegistration: boolean) => void;
    setOpenRegistration: Dispatch<SetStateAction<boolean>>
}

const defaultState = {
    openRegistration: false,
    setOpenRegistration: (openRegistration: boolean) => { }
} as IRegistration;


export const OpenRegistrationContext = createContext(defaultState)

type RegistrationProviderProps = {
    children: React.ReactNode
}

 const OpenRegistrationProvider = ({ children }: RegistrationProviderProps) => {
    const [openRegistration, setOpenRegistration] = useState(false);
    return (
        <OpenRegistrationContext.Provider value={{ openRegistration, setOpenRegistration }}>
            {children}
        </OpenRegistrationContext.Provider>
    )
}

export default OpenRegistrationProvider