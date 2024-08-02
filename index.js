const express = require('express');
const mongoose = require('mongoose');
const Contact = require('./model.js');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
}

connectDB();

app.get('/', (req, res) => {
    res.status(200).send('Contact app');
});

app.get('/:user/contacts', async (req, res) => {
    const { user } = req.params;
    try {
        const contacts = await Contact.find({ user });
        res.status(200).json({
            message: `${user}'s contacts retrieved successfully!!!`,
            contacts,
        });
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        res.status(500).json({ message: 'An error occurred while retrieving contacts' });
    }
});

app.post('/contact', async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({
            message: 'Contact created successfully!!!',
            contact,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Contact validation failed',
            })
        }
        console.error('Error creating contact:', error);
        res.status(400).json({ message: 'An error occurred while creating contact' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
