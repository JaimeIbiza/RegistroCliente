const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

// Inicializar Firebase con las credenciales
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
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
