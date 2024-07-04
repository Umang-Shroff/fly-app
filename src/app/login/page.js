'use client'
import React, {useState, useEffect} from 'react';
import './login.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

const LoginPage = () => {
    const router = useRouter();

    const [user,setUser] = useState({
    username:"",
    password:""
});

useEffect(()=>{
    setTimeout(()=>{
        setLoading(false);
    },5000)
},[])

const [loading,setLoading] = useState(false);
const [errors, setErrors] = useState("");

const onLogin = async (e) => {
    try {
        e.preventDefault();
        setLoading(true);
        setErrors("");
        const resp = await axios.post("/api/users/login",user);
        console.log("response: axios: ",resp)
        toast.success("LogIn Successful");
        router.push("/mainpage");
    } catch (error) {
        // console.log("Login Failed: ",error);
        setErrors(error.response?.data ?? error.message);
        console.log(errors.error);
        toast.error("Login Failed");
        setLoading(false);
    } finally{
        setLoading(false);
    }
}

const forgotPass = async (e) => {
    try {
        e.preventDefault();
        await axios.post("/api/users/mail",user);
        toast.success("Email Sent");
    } catch (error) {
        console.log("Forgot Pass Error", error);
        toast.error("Forgot pass Error", error.message)
    }
}

return (
<>
<Toaster/>
    <div className="center">
        <h1 className="h1">Welcome</h1>
        
        <form method="post">
        
            <div className="txtfield">
                <input onChange={(e)=> setUser({...user, username: e.target.value})} id="inp_username" type="text" placeholder="Username" required/>
            </div><br/>
            <div className="passfield">
                <input onChange={(e)=> setUser({...user, password: e.target.value})} id="inp_passw" type="password" placeholder="Password" required/>
            </div><br/>
            <a id="forgot" href="#" onClick={forgotPass}>Forgot Password?</a>
            {
                loading ? <BeatLoader style={{display:'flex',marginBottom:'45px',top:'15px',position:'relative',left:'180px'}}/> : <button onClick={onLogin} className="submit">Log In</button>
            }
            <span style={{fontWeight:'bold',display:'flex',color:'red',position:'relative',left:'35%'}}>{errors.error}</span>
            <span className="redirect-text">Don't have an account?</span><button className="redirect"><a href="/signup">Sign Up</a></button>
        </form>
    </div>
</>
)
}


export default LoginPage
