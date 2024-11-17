import { useState } from 'react'
import apiClient from '../lib/apiClient';
import { Navigate, useNavigate } from 'react-router-dom';
import { SIGNUP_ROUTE } from '../utils/constants';

const SignUpForm = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const validateSignup = () => {
        if (firstName && lastName && email && password) {
            return true;
        } else {
            return false;
        }
    }

    const handleSignUp = async (e: any) => {
        e.preventDefault();
        try {
            if (validateSignup()) {
                const response = await apiClient.post(SIGNUP_ROUTE, { firstName, lastName, email, password }, { withCredentials: true });
                if (response.data.user._id) {
                    navigate('/home');
                }
                setEmail('')
                setPassword('')
                setFirstName('');
                setLastName('')
            } else {
                //do something
            }
        } catch (error: any) {
            console.error("Error:", error.response.data);
        }
    }

    const route = '/api/v1/signup';
    return (
        <>
            <h1 className='text-[50px]  mb-14 font-alata font-semibold text-black tracking-widest '>Create your Account</h1>

            {/* Form declaration */}
            <form action="" className='w-full'>

                <div className='flex justify-between pb-5'>
                    <input type="text" placeholder='First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 bg-slate-200 block w-[45%] px-3 py-5 h-[50px]  border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        "/>
                    <input type="text" placeholder='Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} className="mt-1 bg-slate-200 block w-[45%] h-[50px] px-3 py-5  border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        "/>

                </div>
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
                    <button onClick={handleSignUp}
                        className='text-lg font-semibold size-full text-green-1 font-alata tracking-[0.2em]'> Create &nbsp; Account</button>
                </div>

            </form>

            <div className='divider text-center my-10 text-slate-500'>or</div>
            <button className='w-full h-[50px] rounded-md bg-slate-200 border border-slate-300 border-opacity-50 font-alata text-black text-lg tracking-[0.1em] '> Already have an account? </button>
        </>
    )
}

export default SignUpForm