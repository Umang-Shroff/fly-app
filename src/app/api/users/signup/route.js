// import {connect} from "@/dbConfig/dbConfig.js";
import User from '@/models/userModel';
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectionSrt } from "@/lib/dbmongo";
import { Users } from '@/lib/model/trial';




export async function POST(request){
    try {
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
        // password:password
    })
    const result = await newUser.save()

    return NextResponse.json({result, success: true})


    } catch (error) {
        return NextResponse.json({error: error},
            {status: 500})
    }
}