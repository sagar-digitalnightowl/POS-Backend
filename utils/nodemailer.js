import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: 'gmail',
//     port: 587,
//   secure: false,
    auth: {
     user: "stranger2copy@gmail.com", //Gmail Address
     pass: "axlt cryx qopc nzds", //Password of gmail (Genrated app password)    
     }
})

export default transport;