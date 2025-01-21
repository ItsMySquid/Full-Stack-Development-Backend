import express from 'express';
import mongoose from 'mongoose';
import blocksRouter from './routes/blocks.js'

const app = express();
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);



// Middleware voor JSON-gegevens
app.use(express.json());

// Middleware voor www-urlencoded-gegevens
app.use(express.urlencoded({ extended: true }));

// Middleware to check if request Accept is application/json
app.use((req, res, next) => {
    if (req.header('Accept') !== 'application/json' && req.method !== "OPTIONS") {
        res.status(406).json('Incorrect format, only JSON is allowed as accept header');
    } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    }
})

app.get('/', (req, res) => {
    res.json({message: "Minecraft Webservice"});
})

app.use('/blocks', blocksRouter);

app.listen(process.env.EXPRESS_PORT,() => {
    console.log("Express server started");
});

