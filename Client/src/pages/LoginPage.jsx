import React, { useContext, useState } from 'react'
import assets from '../assets/assets'

import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setcurrState] = useState("Sign up")
  const [fullName, setfullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const{login}=useContext(AuthContext)

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if(currState==="Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true);
    }
    login(currState==="Sign up"?'signup':'login',{fullName,email,password,bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl px-4 py-10'>
      
      {/* Left Section */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)] drop-shadow-2xl' />

      {/* Right Section */}
      <form onSubmit={onSubmitHandler}
       className='border border-gray-600 bg-white/10 p-8 flex flex-col gap-6 rounded-2xl shadow-2xl backdrop-blur-md w-[min(90vw,350px)]'>
        <h2 className='font-semibold text-2xl flex justify-between items-center text-white tracking-wide'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)}  src={assets.arrow_icon} alt="" className='w-5 cursor-pointer transition-transform hover:scale-110' /> }
          
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setfullName(e.target.value)}
            value={fullName}
            type="text"
            className='p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-300'
            placeholder='Full Name'
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email'
              required
              className='p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-300'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              required
              className='p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white placeholder-gray-300'
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
  <div className="relative">
    <textarea
      onChange={(e) => setBio(e.target.value)}
      value={bio}
      rows={3}
      className="
        w-full
        p-3
        rounded-xl
        border border-gray-500/60
        bg-white/10
        text-white
        placeholder-gray-300
        focus:outline-none
        focus:ring-2
        focus:ring-violet-500
        focus:border-transparent
        resize-none
        shadow-inner
        transition-all
        duration-300
      "
      placeholder="Write a short bio about yourself..."
      required
    />
    <span className="absolute right-3 bottom-2 text-xs text-gray-400">
      {bio.length}/200
    </span>
  </div>
)}


        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-400 text-center mt-3">
              Already have an account?{' '}
              <span
                onClick={() => { setcurrState("Login"); setIsDataSubmitted(false) }}
                className="font-medium text-violet-500 hover:text-violet-400 cursor-pointer transition-colors"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-400 text-center mt-3'>
              Create an account{' '}
              <span
                onClick={() => { setcurrState("Sign up"); setIsDataSubmitted(false) }}
                className='font-medium text-violet-500 hover:text-violet-400 cursor-pointer transition-colors'
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
