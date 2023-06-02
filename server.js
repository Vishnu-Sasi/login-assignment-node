const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const { urlencoded } = require('body-parser');

// Connect to the database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
