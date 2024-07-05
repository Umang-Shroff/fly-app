import nodemailer from 'nodemailer';


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "",
        pass: ""
    }
})

export const mailOptions = {
    from: "",
    to: "",
    
}
