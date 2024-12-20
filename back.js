const nodemailer = require("nodemailer");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const sequelize = require('./configDataBase');
const { Form , Invoice} = require('./models');

const { addForm, getAllForms, getFormByEmail,addInvoice } = require("./models");





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

app.get("/form", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({
      message: "Email-ul nu a fost furnizat!",
    });
  }

  try {
    const form = await getFormByEmail(email);
    if (!form) {
      return res.status(404).json({
        message: "Formularul nu a fost găsit pentru acest email!",
      });
    }

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
  const formData = JSON.parse(req.body.formData);

  const pdfBuffer = req.file ? req.file.buffer : null;
  // if(password!==process.env.FORM_PASS){
  //   return res.status(400).send("Password incorect!!!");
  // }

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
  const result = await addForm(formData);
  if(result.success){
    const resultInvoice = await addInvoice(pdfBuffer,email)
      if(resultInvoice.success){
        try {
          await transporter.sendMail(mailOptions);
          res.status(200).send("Email sent successfully!");
        } catch (error) {
          console.error("Error sending email:", error);
          res.status(500).send("Error sending email: " + error.message);
        }
      }else{
        console.error(resultInvoice.error);
        res.status(500).json({ error:resultInvoice.error });
      }
        
  }else{
    console.error(result.message ,result.err);
    res.status(500).json({ message: result.message, error: result.err });
  }




});

app.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      attributes: ['id', 'name', 'date'],
    });

    res.status(200).json({invoices:invoices});
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).send("Error fetching invoices");
  }
});

app.get('/invoice/:id', async (req, res) => {
  const invoiceId = req.params.id;

  try {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId },
      attributes: ['pdf'],
    });

    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.send(invoice.pdf);
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).send("Error fetching PDF");
  }
});



app.listen(3000, () => console.log("Server is running on port 3000"));