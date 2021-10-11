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


// import * as blackboard from './blackboard';
// import { sendNotifications } from './configrations/apn';

//// 19286545426 - 0(212)-367-60-60:3678
//// MOM 23957103044

export const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, headers: false, message: 'Too Many Request...' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10240kb' }));
app.use(bodyParserError.beautify({ status: 500, res: { msg: 'Unvalid JSON Schema!' } }));
app.use(queryParser());

// app.use(); // { origin: '*', credentials: true }

// hq.quickly.com.tr

app.use('/management', cors(), require('./routes/management'));
app.use('/store', cors(), require('./routes/store'));
app.use('/market', cors(), require('./routes/market'));
app.use('/menu', cors(), require('./routes/menu'));
app.use('/order', cors(corsOptions), OrderMiddleware);

// app.use('/order', cors({ origin: 'http://localhost:8100', credentials: true }), OrderMiddleware);

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
//     const heap = process.memoryUsage().heapUsed / 1024 / 1024;
//     const total_heap = process.memoryUsage().heapTotal / 1024 / 1024;
//     const sysCPU = process.cpuUsage().system / 1024 / 1024;
//     const usrCPU = process.cpuUsage().user / 1024 / 1024;
//     console.log('---------------------------------------')
//     console.log(`System CPU:                     % ${Math.round(sysCPU * 100) / 100}`);
//     console.log(`User   CPU:                     % ${Math.round(usrCPU * 100) / 100}`);
//     console.log('---------------------------------------')
//     console.log(`Memory:                       ${(Math.round(heap * 100) / 100).toFixed(2)} MB`);
//     console.log(`Allocated Heap:               ${(Math.round(total_heap * 100) / 100).toFixed(2)} MB`);
//     console.log('---------------------------------------')
// }, 1000)

/* For Testing New Functions */

// blackboard.Fixer('kosmos-db15');
// blackboard.DailySalesReport('kent-besiktas-8e12');
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
// blackboard.Fixer('kent-besiktas-8e12');
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

// blackboard.allRevisions('kosmos-besiktas','e0b25f64-eede-4d9f-8b40-b6063c6ba286');

// blackboard.databaseLogs('kosmos-besiktas','C-1');
// blackboard.thatDay();
// blackboard.purgeTest('d1265d7d-142a-46d3-8383-261ee97cb577');
// blackboard.recrateDatabase('d1265d7d-142a-46d3-8383-261ee97cb577')
// blackboard.importFromBackup('d622f9dd-036b-4775-bbee-911d301c5b77');
// blackboard.makePdf('kallavi-marmaraforum')
// blackboard.dayDetail('643ed17a-0594-4ff7-bd90-193dac1e71c8','1603048585197')
// blackboard.makePdf('kallavi-marmaraforum');
// blackboard.menuChanger();
// blackboard.makePdf('kallavi-besiktas');
// blackboard.DailySalesReport('kallavi-besiktas');
// processPurchase()
// blackboard.addNotes();
// blackboard.storesInfo2();
// blackboard.documentTransport('kosmos-besiktas', 'order-test', { db_name: 'endday' }, 'fetch');
// blackboard.Fixer('kallavi-besiktas');
// blackboard.clearDatabase('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.purgeTest('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.documentTransport('kallavi-marmaraforum', 'kallavi-besiktas', { db_name: "categories" }, 'update');
// blackboard.reportsTest('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.clearStoreProducts('d622f9dd-036b-4775-bbee-911d301c5b77'
// blackboard.purgeTest('d622f9dd-036b-4775-bbee-911d301c5b77');
// blackboard.menuFixer();

// blackboard.allRevisions('quickly-menu-app','beefroom')

// blackboard.reOpenCheck('kallavi-besiktas','23c19bc4-031d-459f-8972-07100756af8d')
// blackboard.allOrders('kosmos-besiktas','86263601-71fc-4cb1-8c32-4a563d969925')

// blackboard.makePdf('kallavi-besiktas',1630454400000,1633046400000)

// blackboard.getSessions()
// blackboard.fixTables("kallavi-besiktas")
// blackboard.menuToTerminal2('faa92f5e-69d6-41d0-a7be-a0a0159155d7');
// blackboard.clearStoreProducts('d8412bb0-5546-4b78-922e-b7a774daa217');

// blackboard.menuToTerminal2("35530049-06c2-4d1e-b1e2-f9550f94aaf4")


// blackboard.allRevisions('kosmos-besiktas', '81517077-dfc5-48bf-abf1-5eca118832d1')
// blackboard.allOrders('kosmos-besiktas', '93dde37a-9a49-43e0-9ca7-9fb15be66ee1')

// blackboard.deletedRestore('3f5fd0e5-6393-41b2-8df9-a91edd788751');


// sendNotifications().then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err);
// })


// blackboard.creationDateOfStores();


// blackboard.quicklySellingData(2021)

// blackboard.Fixer('kosmos-besiktas');



// blackboard.clearDatabase('d8412bb0-5546-4b78-922e-b7a774daa217')


// blackboard.clearStoreProducts('f93c9160-64e2-4f52-a732-1acd35f0dc46')

// blackboard.menuToTerminal2('f93c9160-64e2-4f52-a732-1acd35f0dc46')

