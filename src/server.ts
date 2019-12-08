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

import * as blackboard from './workers/tables';

//// 19286545426

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, headers: false, message: 'Too Many Request...' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '2048kb' }));
app.use(bodyParserError.beautify({ status: 500, res: { msg: 'Unvalid JSON Schema!' } }));
app.use(cors());
app.use(queryParser());

app.use('/management', require('./routes/management'));
app.use('/store', require('./routes/store'));
app.use('/market', require('./routes/market'));

app.all('/', (req, res) => res.status(404).end());

app.listen(3000, () => console.log('Quickly Head Quarters Started at http://localhost:3000/'));

// setInterval(() => {
//     console.clear();
//     const used = process.memoryUsage().heapUsed / 1024 / 1024;
//     console.log(`Memory ${Math.round(used * 100) / 100} MB`);
// }, 1000)


// TableWorker();

////// Eski Hesaplar Geri Geldiğinde Fixer('VeritabanıAdı'); 
// bambam-burger-pizza-a4cb


// blackboard.Fixer('kosmos-db15');
// blackboard.DailySalesReport('kosmos-db15');
// blackboard.ReportsFixer('quickly-cafe-130c');

// blackboard.getProducts('sdfsdfsd');
// blackboard.StockCleaner();
// blackboard.BackupReportGenerator();
// blackboard.thatDay()
// blackboard.veryOldUpdate();
// blackboard.MoveData()
// blackboard.importProducts()

// blackboard.productToStock('339a35b5-b13c-4184-8b24-b4209d0784f9',10,'867f64c9-297f-4dfb-9030-bd3b5462bbb8').then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })


/* For Standalone No Reverse-Proxy Operations */

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/hq.quickly.com.tr/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/hq.quickly.com.tr/cert.pem', 'utf8');
// const chain = fs.readFileSync('/etc/letsencrypt/live/hq.quickly.com.tr/chain.pem', 'utf8');
// const credentials = { key: privateKey, cert: certificate, ca: chain };
// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);
// httpServer.listen(80, () => {
//     console.log('HTTP Server running on port 80');
// });
// httpsServer.listen(443, () => {
//     console.log('HTTPS Server running on port 443');
// });