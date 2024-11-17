import { useContext } from 'react'
import LoginCards from '../../components/LoginCards';
import { loginContext } from '../../contexts/LoginContext';
import { OpenRegistrationContext } from '../../contexts/RegistrationContext';
import LoginForm from '../../components/LoginForm';
import SignUpForm from '../../components/SignUpForm';

const Auth = () => {
  const {setOpenLogin,openLogin} = useContext(loginContext);
  const {setOpenRegistration,openRegistration} = useContext(OpenRegistrationContext);

  

  return (

    <section className='size-full  bg-white flex center'>
      <div className='  flex justify-between size-[100%] bg-slate-50 rounded-xl'>
        <LoginCards />
        <div className='w-[47%] h-[95%] m-4  rounded-xl flex center flex-col  px-10 '>

         {/* Conditionally render the buttons only when both openLogin and openRegistration are false */}
         {!openLogin && !openRegistration && (
            <>
              <div className='w-full h-[50px] rounded-md bg-blue-3 flex center'>
                <button 
                  onClick={() => setOpenRegistration(true)} 
                  className='text-lg font-semibold size-full text-green-1 font-alata tracking-[0.2em]'>
                  Create &nbsp; Account
                </button>
              </div>
              <button 
                onClick={() => setOpenLogin(true)} 
                className='mt-8 w-full h-[50px] rounded-md bg-grey-4 border border-blue-2 border-opacity-50 font-alata text-green-1 text-lg tracking-[0.1em]'>
                Already have an account?
              </button>
            </>
          )}

          {openLogin ? <LoginForm/>: null}
          {openRegistration ? <SignUpForm/>: null}
        </div>
      </div>
    </section>
  )
}

export default Auth;