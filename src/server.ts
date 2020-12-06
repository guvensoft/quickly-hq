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

import { OrderMiddleware } from './configrations/database'
import { corsOptions } from './configrations/cors';

import * as blackboard from './blackboard';

//// 19286545426 - 0(212)-367-60-60:3678

export const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, headers: false, message: 'Too Many Request...' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10240kb' }));
app.use(bodyParserError.beautify({ status: 500, res: { msg: 'Unvalid JSON Schema!' } }));

app.use(cors({ origin: '*', credentials: false }));
app.use(queryParser());

app.use('/management', require('./routes/management'));
app.use('/store', require('./routes/store'));
app.use('/market', require('./routes/market'));
app.use('/menu', require('./routes/menu'));
app.use('/order', OrderMiddleware);

app.all('/', (req, res) => res.status(404).end());

app.listen(3000, () => console.log('Quickly Head Quarters Started at http://localhost:3000/'));

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


/* Worker Threads */
// import './workers/tables';
// import './workers/activities';

/* Memory Listener Interval */

// setInterval(() => {
//     console.clear();
//     const used = process.memoryUsage().heapUsed / 1024 / 1024;
//     const other = process.cpuUsage().system;
//     console.log(`CPU: ${other} Memory ${Math.round(used * 100) / 100} MB`);
// }, 1000)


/* For Testing New Functions */

// blackboard.Fixer('kosmos-db15');
// blackboard.DailySalesReport('yuri-burger-beer-ecbb');
// blackboard.ReportsFixer('reis-doner-bagcilar-parseller');
// blackboard.getProducts('sdfsdfsd');
// blackboard.StockCleaner();
// blackboard.BackupReportGenerator();
// blackboard.thatDay()
// blackboard.veryOldUpdate();
// blackboard.MoveData()
// blackboard.ReportsClearer('mansion-cafe-restaurant-4b24');
// blackboard.createProductIndexes();
// blackboard.reloadTable('kosmos-db15');
// blackboard.fixTables('kosmos-besiktas');
// blackboard.Fixer('okkali-marmara-forum');
// blackboard.addProperty();
// blackboard.productFinder('');
// blackboard.invoiceReader();
// blackboard.importProducts();
// blackboard.importDatabase();
// blackboard.documentTransport('kosmos-db15', 'quickly-cafe-459c', { db_name: 'tables' });
// blackboard.lastChanges();
// blackboard.documentbackup('quickly-cafe-459c')
// blackboard.reisImport();
// blackboard.addProperty();
// blackboard.allRevisions('okkali-marmara-forum','83644083-a915-48fd-8961-e4045d440d33');
// blackboard.databaseLogs('kosmos-besiktas','C-1');
// blackboard.thatDay();
// blackboard.documentTransport('okkali-marmara-forum', 'kosmos-besiktas', { db_name: 'endday' }, 'fetch');
// blackboard.purgeTest('d622f9dd-036b-4775-bbee-911d301c5b77');
// blackboard.recrateDatabase('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.importFromBackup('d622f9dd-036b-4775-bbee-911d301c5b77');
// blackboard.makePdf('kosmos-besiktas')
// blackboard.dayDetail('643ed17a-0594-4ff7-bd90-193dac1e71c8','1603048585197')

// blackboard.makePdf('okkali-marmara-forum');