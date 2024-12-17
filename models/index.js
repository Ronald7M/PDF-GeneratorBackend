const sequelize = require('../configDataBase'); 


const Form = require('./Form');
const Row = require('./Row');


Form.hasMany(Row, { foreignKey: 'formId', as: 'row' });
Row.belongsTo(Form, { foreignKey: 'formId', as: 'form' });


async function addForm(formData) {
    const t = await sequelize.transaction(); // Începe o tranzacție pentru a asigura consistența datelor

    try {
        // Adăugăm un nou formular în tabelul 'forms'
        const form = await Form.create({
            name: formData.name,
            email: formData.email,
            data: formData.data,
            noInvoice: formData.noInvoice,
            info: formData.info,
            ust: formData.ust,
            noViolin: formData.noViolin,
            noViola: formData.noViola,
            noCello: formData.noCello,
            noKontrabass: formData.noKontrabass,
        }, { transaction: t });

        // Adăugăm rândurile (rows) asociate formularului în tabelul 'rows'
        // Verificăm dacă există 'rows' în formData și le adăugăm
        if (formData.rows && Array.isArray(formData.rows)) {
            for (const row of formData.rows) {
                await Row.create({
                    formId: form.id, // Se leagă rândul de formularul adăugat
                    item: row.item,
                    quantity: row.quantity,
                    price: row.price,
                }, { transaction: t });
            }
        }

        // Dacă totul a fost adăugat cu succes, comite tranzacția
        await t.commit();
        console.log('Formularul și rândurile au fost adăugate cu succes!');
        return form; // Returnează formularul adăugat
    } catch (error) {
        // Dacă apare o eroare, se face rollback la tranzacție
        await t.rollback();
        console.error('Eroare la adăugarea formularului:', error);
        throw error; // Aruncă eroarea pentru a fi gestionată în altă parte
    }
}

async function getAllForms() {
    try {
        const forms = await Form.findAll({
            include: [{
                model: Row,
                as: 'row', // Include rândurile asociate formularului
            }],
        });
        return forms;
    } catch (error) {
        console.error('Eroare la citirea formularelor:', error);
        throw error;
    }
}

async function getFormById(formId) {
    try {
        const form = await Form.findOne({
            where: { id: formId }, // Căutăm formularul după ID
            include: [{
                model: Row,
                as: 'row', // Include rândurile asociate formularului
            }],
        });

        if (!form) {
            throw new Error('Formularul nu a fost găsit!');
        }

        return form;
    } catch (error) {
        console.error('Eroare la citirea formularului:', error);
        throw error;
    }
}


sequelize.sync({ force: false }) 
    .then(() => console.log('Modelele au fost sincronizate cu baza de date.'))
    .catch(err => console.error('Eroare la sincronizare:', err));




module.exports = { Form, Row, addForm ,getAllForms, getFormById };
