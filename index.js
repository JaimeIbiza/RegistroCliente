const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

// Inicializar Firebase con las credenciales
const serviceAccount = require('./path/to/your/firebase-key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<your-project-id>.firebaseio.com"
});

const db = admin.firestore();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para guardar datos
app.post('/guardar-datos', async (req, res) => {
    const { name, email, phone, ticket } = req.body;

    try {
        const existingUser = await db.collection('clientes').where('email', '==', email).get();
        if (!existingUser.empty) {
            return res.status(400).json({ message: "Cliente ya existente" });
        }

        await db.collection('clientes').add({
            name,
            email,
            phone,
            ticket: ticket ? "Sí" : "No"
        });

        res.status(200).json({ message: "Datos guardados exitosamente" });
    } catch (error) {
        console.error("Error guardando datos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});