const express = require('express');
const connectDB = require('./config/db');
const auth = require('./routes/auth')
const tasks = require('./routes/tasks')
const cors = require("cors")
const app = express();

connectDB();
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
};

app.use(express.json());
app.use(cors(corsOptions))
app.get("/", (req, res) =>{
    res.send('Api is running')
})

app.use('/api/auth', auth)
app.use('/api/tasks', tasks)

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
