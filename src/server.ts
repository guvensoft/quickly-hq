import http from 'http';
import https from 'https';
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

// import swagger from 'express-swagger-generator';
// import { TablesWorker, Fixer, StockCleaner, BackupReportGenerator, DailySalesReport, thatDay, veryOldUpdate, MoveData, ReportsFixer, getProducts } from './workers/tables';
// import { dailyStockExpense } from './functions/stocks';
// import { importAdress, getCities, createIndexesForDatabase } from './functions/address';

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

// app.listen(3000, () => console.log('Quickly Head Quarters Started at http://localhost:3000/'));


const privateKey = fs.readFileSync('/etc/letsencrypt/live/quickly.com.tr/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/quickly.com.tr/cert.pem', 'utf8');
const chain = fs.readFileSync('/etc/letsencrypt/live/quickly.com.tr/chain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: chain };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

////// Eski Hesaplar Geri Geldiğinde Fixer('VeritabanıAdı'); 

// Fixer('yuri-burger-beer-ecbb');

// DailySalesReport('yuri-burger-beer-ecbb');

// TablesWorker();

// ReportsFixer('kosmos-db15');

// getProducts('sdfsdfsd');

// StockCleaner();

// BackupReportGenerator();

// thatDay()

// veryOldUpdate();

// MoveData()

// dailyStockExpense();

// importAdress();

// getCities()

// createIndexesForDatabase();


// const expressSwagger = swagger(app);

// let options = {
//     swaggerDefinition: {
//         info: {
//             description: 'Quickly Hq Api Docs',
//             title: 'Swagger',
//             version: '1.0.0',
//         },
//         host: 'localhost:3000',
//         basePath: '/',
//         produces: [
//             "application/json",
//         ],
//         schemes: ['http', 'https'],
//         securityDefinitions: {
//             JWT: {
//                 type: 'apiKey',
//                 in: 'header',
//                 name: 'Authorization',
//                 description: "",
//             }
//         }
//     },
//     basedir: __dirname, //app absolute path
//     files: ['./routes/**/*.js'] //Path to the API handle folder
// };
// expressSwagger(options)