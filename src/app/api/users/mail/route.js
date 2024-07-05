import { NextResponse } from "next/server";
import { Users } from "@/lib/model/trial";
import mongoose from "mongoose";
import { connectionSrt } from "@/lib/dbmongo";
import { mailOptions,transporter } from "@/lib/nodemailer";

export async function POST(request){
    try {
        const body = await request.json();
        const username = body.username;

        await mongoose.connect(connectionSrt);

        const check = await Users.find({username: username},{password:1, _id:0})
        // return NextResponse.json({check , success:true});
        
        await transporter.sendMail({
            ...mailOptions,
            subject:body.subject,
            text:"Email Sent",
            html:`<h1>Forgot Password Email</h1><h3>Username: ${body.username}</h3><h3>${check}</h3>`
        })
        const result = "email sent"
        return NextResponse.json({result, success: true})

    } catch (error) {
        return NextResponse.json({error: error.message},{status:400})
    }
}
