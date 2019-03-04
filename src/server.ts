import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

//// 19286545426

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, headers: false, message: { ok: false, message: 'Too Many Request...' } }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('', require('./configrations/routes'));

app.all('/', (req, res) => res.status(404).end());

app.listen(3000, () => console.log('Quickly Reporter Started at http://localhost:3000/'));