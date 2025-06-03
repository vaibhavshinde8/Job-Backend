import nodemailer from 'nodemailer';


const  Email=async(email,subject,content)=>{
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'test93224316@gmail.com',
        pass: 'jqcjmsvxfcfubtzd' // App Password
    }
});


let mailDetails = {
    from: 'test93224316@gmail.com',
    to: email,
    subject: subject,
    text: content
};


    mailTransporter.sendMail(mailDetails, (err, data) => {
        if (err) {
            console.log('Error Occurs: ' + err);
            
        } else {
            console.log("SUcssefullu data sent"+data)
           return true;

        }
    });
}
export default Email