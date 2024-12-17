const nodemailer = require("nodemailer");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const sequelize = require('./configDataBase');
const { Form, Row} = require('./models');
const { addForm, getAllForms, getFormById } = require("./models");


sequelize.sync({ force: false })
    .then(() => console.log('Modelele au fost sincronizate cu baza de date.'))
    .catch(err => console.error('Eroare la sincronizare:', err));



const app = express();
app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.get("/test",  async (req, res) => {
    return res.status(200).send("Salut!!!");
  

  });

  app.post("/form", async (req, res) => {
    const formData = req.body;

    try {
        const form = await addForm(formData);
        return res.status(201).json({
            message: "Formularul a fost adăugat cu succes!",
            form: form,
        });
    } catch (error) {
        console.error("Eroare la adăugarea formularului:", error);
        return res.status(500).json({
            message: "A apărut o eroare la adăugarea formularului.",
            error: error.message,
        });
    }
});

app.get("/forms", async (req, res) => {
  try {
      const forms = await getAllForms();
      return res.status(200).json({
          message: "Formulare obținute cu succes!",
          forms: forms,
      });
  } catch (error) {
      console.error("Eroare la obținerea formularelor:", error);
      return res.status(500).json({
          message: "A apărut o eroare la obținerea formularelor.",
          error: error.message,
      });
  }
});

app.get("/form/:id", async (req, res) => {
  const formId = req.params.id;

  try {
      const form = await getFormById(formId);
      return res.status(200).json({
          message: "Formular obținut cu succes!",
          form: form,
      });
  } catch (error) {
      console.error("Eroare la obținerea formularului:", error);
      return res.status(500).json({
          message: "A apărut o eroare la obținerea formularului.",
          error: error.message,
      });
  }
});


app.post("/send-email", upload.single("pdf"), async (req, res) => {
  const { email, subject, message, password } = req.body; 
  const pdfBuffer = req.file ? req.file.buffer : null;
  if(password!==process.env.FORM_PASS){
    return res.status(400).send("Password incorect!!!");
  }

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