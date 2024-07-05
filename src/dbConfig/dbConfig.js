import mongoose from 'mongoose';

export async function connect(){
    try{
        await mongoose.connect("mongodb+srv://iLambor55:123456789101112@cluster0.hnumv7z.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0");
        const connection = mongoose.connection;

        connection.on('connected', ()=>{
            console.log("MongoDB connected");
        })

        connection.on('error', (err)=>{
            console.log("MongoDB connection error" + err);
            process.exit();
        })

    }catch(error){
        console.log("Error at connection");
        console.log(error);
    }
}