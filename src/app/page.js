'use client'
import toast, {Toaster} from "react-hot-toast";
import Link from "next/link";
import './index.css'

export default function Home() {

  return (
    <>
      <h1><Link href="/signup"><button className="btn">Sign Up</button></Link></h1>
      <h1><Link href="/login"><button className="btn">Log In</button></Link></h1>
    </>
  );
}
