const nodemailer = require("nodemailer");
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.get("/test",  async (req, res) => {
    return res.status(200).send("Salut!!!"+process.env.EMAIL_USER+" "+process.env.EMAIL_PASS);

  });



app.post("/send-email", upload.single("pdf"), async (req, res) => {
  const { email, subject, message } = req.body; 
  const pdfBuffer = req.file ? req.file.buffer : null;

  if (!pdfBuffer) {
    return res.status(400).send("No PDF file uploaded");
  }
  if (!email) {
    return res.status(400).send("No email recipient specified");
  }

  
  

  const transporter = nodemailer.createTransport({
    service: "gmail",  
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,  
    },
  });

 
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: email, 
    subject: subject,  
    text: message,  
    attachments: [
      {
        filename: "invoice.pdf",  
        content: pdfBuffer, 
        encoding: "base64", 
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email: " + error.message);
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));