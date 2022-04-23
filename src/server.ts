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

import { OrderMiddleware, StoreDB } from './configrations/database'
import { corsOptions } from './configrations/cors';

import * as blackboard from './blackboard';

//// 19286545426 - 0(212)-367-60-60:3678
//// MOM 23957103044
//// 4245 897e a8ae 8d36 Guzel

export const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, headers: false, message: 'Too Many Request...' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10240kb' }));
app.use(bodyParserError.beautify({ status: 500, res: { msg: 'Unvalid JSON Schema!' } }));
app.use(queryParser());

app.use((req,res,next) => { console.log(req.method,req.url); next() }) 


app.use('/management', cors(), require('./routes/management'));
app.use('/store', cors(), require('./routes/store'));
app.use('/market', cors(), require('./routes/market'));
app.use('/menu', cors(), require('./routes/menu'));
// app.use('/order', cors(corsOptions), OrderMiddleware);

app.use('/order', cors({ origin: 'http://localhost:8100', credentials: true }), OrderMiddleware);

app.all('/*', (req, res) => res.status(404).end());


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
// import './configrations/signature';

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


// // MUST HACK

// https://qr.disoo.co/qr/601715

// blackboard.allRevisions('quickly-menu-app','kazan-meyhane');

/* For Testing New Functions */


// sendNotifications().then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err);
// })


///////// DDOS Protection
// grep sshd.\*Failed /var/log/auth.log | less


// blackboard.makeProforma()
// blackboard.addProperty()
// blackboard.updateStoreDetail(); 
// blackboard.Fixer('kosmos-besiktas')
// blackboard.fixTables('haora-cafe')
// blackboard.invoiceReader()
// blackboard.makePdf('3f5fd0e5-6393-41b2-8df9-a91edd788751',1641030909000,1643709309000)
// blackboard.allOrders('kosmos-besiktas','9b3a6069-427e-4bb0-b9a6-1175078e7df6');
// blackboard.allRevisions('kosmos-besiktas','9b3a6069-427e-4bb0-b9a6-1175078e7df6')
// exportReportFromDaysData('3f5fd0e5-6393-41b2-8df9-a91edd788751','1643709309000','1643709309000')
// blackboard.updateStoreDetail()
// blackboard.fixTables('kallavi-marmaraforum');
// blackboard.updateTerminalWithMenu('d675d07a-671a-4623-b953-6bf0e55745a1')




// blackboard.clearOrders('9bc2c532-634e-433e-ba97-224fdf4fa0d5')
// dailyStockExpense()

// clearStoreDatabase('22d9fc30-e497-48eb-a9e8-484ac50e5d57').then(isOk => {
//     console.log(isOk)
// }).catch(err => {
//     console.log(err);
// })

// blackboard.menuToTerminal2('d8412bb0-5546-4b78-922e-b7a774daa217')
// blackboard.clearOrders('294959af-eda3-4196-83db-b9886e4d66e3')
// blackboard.Fixer('kallavi-besiktas')
// blackboard.makeProforma()

// blackboard.clearStoreProducts('3f5fd0e5-6393-41b2-8df9-a91edd788751')
// blackboard.documentTransport('kallavi-besiktas','kallavi-marmaraforum',{db_name:'products'},'update');
// blackboard.fixTables('kallavi-marmaraforum')
// blackboard.findDuplicates('294959af-eda3-4196-83db-b9886e4d66e3')
// blackboard.menuToTerminal2('5d1fde38-459b-4b36-811a-d43fa4146aa3')
// blackboard.clearOrders('3f5fd0e5-6393-41b2-8df9-a91edd788751')

// clearStoreDatabase('3f5fd0e5-6393-41b2-8df9-a91edd788751').then(isOk => {
//     console.log(isOk)
// }).catch(err => {
//     console.log(err);
// })

// blackboard.menuToTerminal2('e61fa1f8-4bb6-4658-b782-efdea1b6d557')
// blackboard.storeDays('22d9fc30-e497-48eb-a9e8-484ac50e5d57','1646148108000','1647357708000');
// blackboard.allOrders('kosmos-besiktas','37da827c-45f8-4679-96c6-b8f3a879e18c')
// blackboard.clearOrders('3f5fd0e5-6393-41b2-8df9-a91edd788751');
// blackboard.Fixer('haora-cafe')
// blackboard.fixTables('haora-cafe')

// blackboard.makeProforma()


// blackboard.invoiceReader();


// blackboard.storeDays('d675d07a-671a-4623-b953-6bf0e55745a1','1640995218000','1643673618000')
// blackboard.storeDays('d675d07a-671a-4623-b953-6bf0e55745a1','1643673618000','1646092818000')
// blackboard.storeDays('2275d56d-b704-4d96-a8f9-4b2d8ecfa52d','1646092818000','1648771218000')

// blackboard.allOrders('kosmos-besiktas','6cebba49-09bf-4cfb-adba-6a97123bc228')
// blackboard.allRevisions('kosmos-besiktas','6cebba49-09bf-4cfb-adba-6a97123bc228')


// blackboard.menuToTerminal2('cb3a996a-2bd2-42f6-9b5f-801c5b4138a7')

// blackboard.fixTables('kosmos-besiktas')


// blackboard.storeDays('9bc2c532-634e-433e-ba97-224fdf4fa0d5','1646120636000','1648799036000');


// blackboard.MoveData('ornek-menu','eleven-brothers',{db_name:'cashbox_categories'})

// blackboard.clearOrders('3f5fd0e5-6393-41b2-8df9-a91edd788751');

// blackboard.allRevisions('eleven-bothers','350e0e9c04f4fb5a2e0a544515072fdf')


// blackboard.BackupReportGenerator()
// blackboard.storeDays('f93c9160-64e2-4f52-a732-1acd35f0dc46','1633813200000','1649789507527')


// blackboard.productReports('f93c9160-64e2-4f52-a732-1acd35f0dc46','1633889117000','1636589117000')

// /store/reports/sales/1633813200000/1649789507527


// blackboard.clearOrders('d622f9dd-036b-4775-bbee-911d301c5b77')

// blackboard.clearStoreProducts('d622f9dd-036b-4775-bbee-911d301c5b77')

// blackboard.clearDatabase('d622f9dd-036b-4775-bbee-911d301c5b77')

// blackboard.backupStoreDatabase('d675d07a-671a-4623-b953-6bf0e55745a1');

// blackboard.clearStoreProducts('d675d07a-671a-4623-b953-6bf0e55745a1')

// blackboard.menuToTerminal2('d675d07a-671a-4623-b953-6bf0e55745a1')

// blackboard.loadStoreBackup('9bc2c532-634e-433e-ba97-224fdf4fa0d5','tables')


// blackboard.clearDatabase('22d9fc30-e497-48eb-a9e8-484ac50e5d57')

// blackboard.clearStoreProducts('9bc2c532-634e-433e-ba97-224fdf4fa0d5')

// blackboard.MoveData()

// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'products'},'fetch');
// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'categories'},'fetch');
// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'sub_categories'},'fetch');
// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'reports', type:'Product'},'fetch');


// blackboard.storeProductSales('d675d07a-671a-4623-b953-6bf0e55745a1','1648802856000','1651394856000')

// blackboard.storeDays('9bc2c532-634e-433e-ba97-224fdf4fa0d5','1641025530000','1643703930000')

// blackboard.Fixer('haora-cafe')

// blackboard.fixTables('haora-cafe');

// blackboard.storeDays('22d9fc30-e497-48eb-a9e8-484ac50e5d57','1650010101000','1650701301000')



