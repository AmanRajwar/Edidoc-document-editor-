import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoginContextProvider from './contexts/LoginContext.tsx'
import OpenRegistrationProvider from './contexts/RegistrationContext.tsx'
import ToastProvider from './contexts/ToastContext.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { SocketProvider } from './contexts/socketContext.tsx'
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <SocketProvider>
      <ToastProvider>
        <OpenRegistrationProvider>
          <LoginContextProvider>
            <App />
          </LoginContextProvider>
        </OpenRegistrationProvider>
      </ToastProvider>
    </SocketProvider>
  </Provider>


)
