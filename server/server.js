const express = require('express');
const connectDB = require('./config/db');
const auth = require('./routes/auth')
const tasks = require('./routes/tasks')
const cors = require("cors")
const app = express();

connectDB();

app.use(express.json());
app.options('*', cors()); // Handle preflight requests for all routes

// Enable CORS
app.use(cors({
    origin: 'https://becomeproductive.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Example API route
app.get('/api/some-route', (req, res) => {
    res.json({ message: 'CORS is working!' });
});


app.get("/", (req, res) =>{
    res.send('Api is running')
})

app.use('/api/auth', auth)
app.use('/api/tasks', tasks)

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
