import mongoose from 'mongoose';

export async function connect(){
    try{
        await mongoose.connect("MONGO_URI");
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
