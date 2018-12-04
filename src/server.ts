import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const app = express();

//// 19286545426

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('', require('./configrations/routes'));

app.all('/', (req, res) => res.status(404).end());

app.listen(3000, () => console.log('Quickly Reporter Started at http://localhost:3000/'));