import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "soyumang55@gmail.com",
        pass: "tnch gnkk kfnp lxmb"
    }
})

export const mailOptions = {
    from: "soyumang55@gmail.com",
    to: "soyumang55@gmail.com",
    
}