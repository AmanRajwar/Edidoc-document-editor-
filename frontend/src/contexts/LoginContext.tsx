
import React, { createContext, Dispatch, SetStateAction, useState } from 'react'

interface ILogin {
  openLogin: boolean;
  setOpenLogin: Dispatch<SetStateAction<boolean>>
}
const defaultValue = {
  openLogin: false,
  setOpenLogin: (_: boolean) => { }
} as ILogin;

export const loginContext = createContext(defaultValue);

type LoginContextProps = {
  children: React.ReactNode;
}

const OpenLoginProvider = ({ children }: LoginContextProps) => {
  const [openLogin, setOpenLogin] = useState(false)
  return (
    <loginContext.Provider value={{ openLogin, setOpenLogin }}>
      {children}
    </loginContext.Provider>
  )
}

export default OpenLoginProvider;