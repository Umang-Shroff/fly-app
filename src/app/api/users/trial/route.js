import mongoose from "mongoose";
import { connectionSrt } from "@/lib/db";
import { NextResponse } from "next/server";
import { Users } from "@/lib/model/trial";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

// export async function GET(){

//     await mongoose.connect(connectionSrt)
//     const data = await Users.find()
//     return NextResponse.json({result: data})
// }


// export async function POST(request){
//     const payload = await request.json();
//     await mongoose.connect(connectionSrt);
//     let user = new Users(payload);
//     const result = await user.save()
//     return NextResponse.json({result, success: true})

// }


// SIGN UP

export async function POST(){
    try{
    const body = await request.json();
    const {username,password} = body;

    await mongoose.connect(connectionSrt);

    const existing = await Users.findOne({username});
    if(existing){
        return NextResponse.json({ error:"User exists"}, {status: 400})
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new Users({
        username,
        password: hashedPassword
    })
    const result = await newUser.save()

    return NextResponse.json({result, success: true})
    }
    catch(error){
        return NextResponse.json({error: error}, {status: 500})
    }
}



// LOGIN
