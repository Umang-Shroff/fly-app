// import { connect } from "mongoose";
// import User from "@/models/userModel";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { connectionSrt } from "@/lib/dbmongo";
import { NextResponse } from "next/server";
import { Users } from "@/lib/model/trial";
import bcryptjs from 'bcryptjs';

// connect();

export async function POST(request){
    try{
        const body = await request.json();
    const {username,password} = body;

    await mongoose.connect(connectionSrt);

    const user = await Users.findOne({username})
    if(!user){
        return NextResponse.json({error: "User does not exist"},{status:400})
    }

    const validPass = await bcryptjs.compare(password, user.password)
    if(!validPass){
        return NextResponse.json({error: "Invalid Password"}, {status: 400})
    }

    const tokenData = {
        id: user._id,
        username: user.username
    }


    const token = await jwt.sign(tokenData, "secretkey", {expiresIn: "1d"})

    const result = NextResponse.json({
        message:"Login Successful",
        success:true,
    })
    result.cookies.set("token",token,{httpOnly:true,})
    return result;

    }catch(error){
        return NextResponse.json({error: error.response},
            {status: 500})
    }
}