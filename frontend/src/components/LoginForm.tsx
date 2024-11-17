import {useState } from 'react'
import apiClient from '../lib/apiClient';
import {  useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { openToast } from '../redux/features/ToastSlice';
import { setUser } from '../redux/features/userSlice';
import { LOGIN_ROUTE } from '../utils/constants';

const LoginForm = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch()

  const validateLogin = () => {
    if (email && password) {
      return true;
    } else {
      return false;
    }
  }


  const handleLogIn = async (e: any) => {
    e.preventDefault();
    try {
      if (validateLogin()) {
        console.log(email, password)
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        if (response.data.user._id) {
          dispatch(setUser(response.data.user._id))
          navigate('/home');
        }
        setEmail('')
        setPassword('')
      } else {
        dispatch(openToast('Enter full details !'))
      }
    } catch (error: any) {
      console.error("Error:", error.response.data);
    }
  }

  return (
    <>
      <h1 className='text-[50px]  mb-14 font-alata font-semibold text-black tracking-widest '>Log in to Document Editor</h1>

      {/* Form declaration */}
      <form action="" className='w-full'>

        <input
          type="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 bg-slate-200 block w-full h-[50px] px-3 mb-5  border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      "/>
        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=" bg-slate-200 block w-full h-[50px] px-3 mt-5  border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      "/>

        <div className='w-full h-[50px] rounded-md bg-blue-3 border border-blue-500 mt-5 flex center'>
          <button onClick={handleLogIn}
            className='text-lg font-semibold size-full text-white font-alata tracking-[0.2em]'> Log In</button>
        </div>

      </form>

      <div className='divider text-center my-10 text-slate-500'>or</div>
      <button className='w-full h-[50px] font-semibold rounded-md bg-slate-200 border border-slate-300 border-opacity-50 font-alata text-black text-lg tracking-[0.1em] '> Don't have an account? </button>
    </>
  )
}

export default LoginForm;