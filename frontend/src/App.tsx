import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/auth/auth'
import Home from './pages/home/home'
import { RootState, useAppDispatch, useAppSelector } from './redux/store'
import { closeToast } from './redux/features/ToastSlice'
import Toast from './components/Toast'
import { ReactNode, useEffect } from 'react'
import apiClient from './lib/apiClient'
import { GET_USER_INFO } from './utils/constants'
import { setUser } from './redux/features/userSlice'
import DocumentEditor from './pages/document/DocumentEditor'

type props = {
  children: ReactNode;
}

const PrivateRoute = ({ children }: props) => {
  const { user } = useAppSelector((state: RootState) => state.user);
  const isAuthenticated = !!user;
  return isAuthenticated ? <>{children}</> : <Navigate to='/auth' />
}

const AuthRoute = ({ children }: props) => {
  const { user } = useAppSelector((state: RootState) => state.user);
  const isAuthenticated = !!user;
  return isAuthenticated ? <Navigate to='/home' /> : <>{children}</>
}
function App() {
  const messages = useAppSelector((state: RootState) => state.toast.messages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.data.user._id) {
          dispatch(setUser(response.data.user._id));
        }
      } catch (error: any) {
        console.log(error);
      }
    }
    getUser()
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Navigate to='/auth' />} />

          <Route
            path='/auth'
            element={
              <AuthRoute >
                <Auth />
              </AuthRoute >
            }
          />

          <Route
            path='/home'
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path='/create-document'
            element={
              <PrivateRoute>
                <DocumentEditor />
              </PrivateRoute>
            }
          />

          <Route
            path='/document/:id'
            element={
              <PrivateRoute>
                <DocumentEditor />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <div className="fixed bottom-1 right-1 z-50 ">
        {messages.map((msg) => (
          <Toast key={msg.id} message={msg.message} close={() => dispatch(closeToast(msg.id))} />
        ))}
      </div>
    </>
  );
}

export default App;
