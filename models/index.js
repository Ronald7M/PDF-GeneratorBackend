const sequelize = require('../configDataBase'); 


const Form = require('./Form');
const Invoice = require('./Invoice');





async function addInvoice(pdfBuffer, name) {
const currentDate = new Date();
const formattedDateTime = currentDate.toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
});
    try {
        const tableRecord = await Invoice.create({
          name: name,  
          pdf: pdfBuffer, 
          date:formattedDateTime,
        });
    
        return {success:true} 
      } catch (error) {
        return {success:false,error} 
      }
}


async function addForm(formData) {
    try {
        // Căutăm un formular cu același email
        const existingForm = await Form.findOne({
            where: { email: formData.email }
        });

        if (existingForm) {
            // Dacă există un formular cu acest email, facem update
            await existingForm.update({
                name: formData.name,
                data: formData.data,
                noInvoice: formData.numberInvoice,
                info: formData.info,
                ust: formData.ust
            });

            return { success: true, message: "Formular actualizat cu succes" };
        } else {
            // Dacă nu există, creăm unul nou
            const form = await Form.create({
                name: formData.name,
                email: formData.email,
                data: formData.data,
                noInvoice: formData.numberInvoice,
                info: formData.info,
                ust: formData.ust
            });

            return { success: true, message: "Formular adaugat cu succes" };
        }
    } catch (error) {
        return { success: false, message: "Formularul nu a fost adaugat sau actualizat", err: error };
    }
}
async function getAllForms() {
    try {
        const forms = await Form.findAll();
        return forms;
    } catch (error) {
        console.error('Eroare la citirea formularelor:', error);
        throw error;
    }
}

async function getFormByEmail(email) {
    try {
      const form = await Form.findOne({
        where: { email: email }
    });
      return form;
    } catch (error) {
      console.error("Eroare la căutarea formularului:", error);
      throw error;
    }
  }



sequelize.sync({ force: false }) 
    .then(() => console.log('Modelele au fost sincronizate cu baza de date.'))
    .catch(err => console.error('Eroare la sincronizare:', err));




module.exports = {Invoice,Form, addForm ,getAllForms, getFormByEmail,addInvoice };
