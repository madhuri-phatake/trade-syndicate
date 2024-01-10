require("dotenv").config();
const mongoose = require("mongoose");
const FormModel = require("../models/FormModel");
const nodemailer = require("nodemailer");
const axios = require("axios");

exports.save_form_model = async (req, res, next) => {
  const newData = new FormModel({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    massege: req.body.message
  });

  try {
    const info = await newData.save();
    if(info){
      const {recaptchaResponse} = req.body

      const secretKey = "6Lf0Yi4pAAAAAED5O3Ii9UP-Zw1LKuCwkYVqAnc8"; // Replace with your secret key obtained from reCAPTCHA admin console
 
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
 
      const googleResponse = await axios.post(verificationURL);
      const { success } = googleResponse.data;
 
     if(success){
      // const { firstName, email, phone, message,subject } = req.body;
      // console.log(firstName,email,phone,message,subject)
      // // Create a Nodemailer transporter
      // const transporter = nodemailer.createTransport({
      //   service: "Gmail", // Use your email service provider
      //   secure: false,
      //   auth: {
      //     user: "elevatorplusapp@gmail.com", // Replace with your email
      //     pass: "wnbeedsiuxcwhpwf" // Replace with your password
      //   },
      //   debug: true
      // });
 
      // // Email data
      // const mailOptions = {
      //   from: "elevatorplusapp@gmail.com",
      //   to: "elevatorplusapp@gmail.com", // Replace with recipient email
      //   subject: "ElevatorPlus Contact Form Submission",
      //   html: `
      //         <h2>ElevatorPlus Contact Us Form Submission By ${firstName }</h2>
      //         <p><strong>Name:</strong> ${firstName}</p>
      //          <p><strong> Email:</strong> ${email}</p>
      //          <p><strong> Phone Numbar:</strong> ${phone} </p>
      //          <p><strong> Subject::</strong> ${subject} </p>
      //          <p><strong> Message::</strong> ${message} </p>
 
      //         `
      // };
 
      // Send email
      // Send a response to the client
      try {
        // const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).json({
          data: info.response,
          message: "Email sent successfully",
          status: true
        });
      } catch (error) {
        console.error('Error occurred:', error);
        console.error("Error sending email:", error);
        // Send an error response to the client
        res.status(500).json({
          message: "Error sending email",
          status: false
        });
      }
 
     }else{
      console.error("Error sending email:", error);
      // Send an error response to the client
      res.status(500).json({
        message: "Error sending email",
        status: false,
        data:error
      });
     }
    }else{
      console.error("Error sending email:", error);
      // Send an error response to the client
      res.status(500).json({
        message: "Error sending email",
        status: false,
        data:error
      });
    }
  } catch (Error) {
    return res.status(500).json({
      message: "Error sending email",
      status: false,
      data:Error
    });
  }
};


//Get data
exports.get_form_data = (req, res) => {
  FormModel.find({}).sort({_id : -1})
    .then((data) => {
      res.json({
        title: "success",
        status: true,
        data:data,
        message: "Data retrieved successfully"
      });
    })
    .catch((err) => {
      res.status(500).json({
        title: "error",
        status: false,
        message: "Failed to retrieve data",
        error: err.message
      });
    });
};

// Define middleware to rate limit email sending
// const emailRateLimit = (req, res, next) => {
//   const now = Date.now();
//   const interval = 60 * 1000; // 1 minute

//   if (!req.emailLastSent || now - req.emailLastSent >= interval) {
//     req.emailLastSent = now;
//     next(); // Allow sending the email
//   } else {
//     res
//       .status(429)
//       .send("Too many requests. Please wait before sending another email.");
//   }
// };

// // async function send_email(req, res) {
//     try {
//         const {recaptchaResponse} = req.body

//        const secretKey = "6Lf0Yi4pAAAAAED5O3Ii9UP-Zw1LKuCwkYVqAnc8"; // Replace with your secret key obtained from reCAPTCHA admin console

//        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

//        const googleResponse = await axios.post(verificationURL);
//        const { success } = googleResponse.data;

//       if(success){
//        const { firstName, email, phone, message,subject } = req.body;
//        console.log(firstName,email,phone,message,subject)
//        // Create a Nodemailer transporter
//        const transporter = nodemailer.createTransport({
//          service: "Gmail", // Use your email service provider
//          secure: false,
//          auth: {
//            user: "elevatorplusapp@gmail.com", // Replace with your email
//            pass: "wnbeedsiuxcwhpwf" // Replace with your password
//          },
//          debug: true
//        });

//        // Email data
//        const mailOptions = {
//          from: "elevatorplusapp@gmail.com",
//          to: "elevatorplusapp@gmail.com", // Replace with recipient email
//          subject: "ElevatorPlus Contact Form Submission",
//          html: `
//                <h2>ElevatorPlus Contact Us Form Submission By ${firstName }</h2>
//                <p><strong>Name:</strong> ${firstName}</p>
//                 <p><strong> Email:</strong> ${email}</p>
//                 <p><strong> Phone Numbar:</strong> ${phone} </p>
//                 <p><strong> Subject::</strong> ${subject} </p>
//                 <p><strong> Message::</strong> ${message} </p>

//                `
//        };

//        // Send email
//        // Send a response to the client
//        try {
//          const info = await transporter.sendMail(mailOptions);
//          console.log('Email sent: ' + info.response);
//          res.status(200).json({
//            data: info.response,
//            message: "Email sent successfully",
//            status: true
//          });
//        } catch (error) {
//          console.error('Error occurred:', error);
//          console.error("Error sending email:", error);
//          // Send an error response to the client
//          res.status(500).json({
//            message: "Error sending email",
//            status: false
//          });
//        }

//       }

//      } catch (error) {
//        console.error("Error sending email:", error);
//        // Send an error response to the client
//        res.status(500).json({
//          message: "Error sending email",
//          status: false,
//          data:error
//        });
//      }
// }
