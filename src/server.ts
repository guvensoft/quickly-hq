import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import bodyParserError from 'bodyparser-json-error';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import queryParser from 'express-query-int';

import { TablesWorker, Fixer, StockCleaner, BackupReportGenerator, DailySellingReport, thatDay, veryOldUpdate, MoveData } from './workers/tables';

//// 19286545426

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, headers: false, message: { ok: false, message: 'Too Many Request...' } }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParserError.beautify({ status: 500, res: { msg: 'Unvalid JSON Schema!' } }));

app.use(cors());
app.use(queryParser());

app.use('/management', require('./routes/management'));
app.use('/store', require('./routes/store'));

app.all('/', (req, res) => res.status(404).end());

app.listen(3000, () => console.log('Quickly Reporter Started at http://localhost:3000/'));


// TablesWorker();

// console.log(databasePath);

// Fixer();

DailySellingReport();

// StockCleaner();

// BackupReportGenerator();

// thatDay()

// veryOldUpdate();

// MoveData()