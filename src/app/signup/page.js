'use client'
import React, {useState} from 'react';
import './signup.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';

const SignupPage = () => {
    const router = useRouter();

    const [user,setUser] = useState({
        username:"",
        password:""
    });

    const onSignup = async (e) => {
        try {
            e.preventDefault();
            const resp = await axios.post("/api/users/signup",user);
            toast.success("SignUp Success")
            router.push("/login");

        } catch (error) {
            console.log("Signup failed ",error.response.data);
            toast.error("SignUp Failed", error);
        }
    }

  return (
    <>
    <Toaster/>
        <div className="center">
            <h1 className="h1">Register</h1>
            <form>
                <div className="txtfield">
                    <input onChange={(e)=> setUser({...user, username: e.target.value})} id="inp_username" type="text" placeholder="Username" required/>
                </div><br/>
                {/* <div className="mailfield">
                    <input onChange={(e)=> setUser({...user, email: e.target.value})} type="email" placeholder="Email" required/>
                </div><br/> */}
                <div className="passfield">
                    <input onChange={(e)=> setUser({...user, password: e.target.value})} id="inp_passw" type="password" placeholder="Password" required/>
                </div><br/>
                <button onClick={onSignup} className="submit">Sign Up</button>
                <span className="redirect-text">Already have an account?</span><button className="redirect"><a href="/login">Log In</a></button>
            </form>
            
        </div>
    </>
  )
}

export default SignupPage
