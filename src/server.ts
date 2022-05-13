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


//// D 19286545426
//// Y 23957103044

export const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, headers: false, message: 'Too Many Request...' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10240kb' }));
app.use(bodyParserError.beautify({ status: 500, res: { msg: 'Unvalid JSON Schema!' } }));
app.use(queryParser());

app.use((req, res, next) => { console.log(req.method, req.url); next() })

app.use('/management', cors(), require('./routes/management'));
app.use('/store', cors(), require('./routes/store'));
app.use('/market', cors(), require('./routes/market'));
app.use('/menu', cors(), require('./routes/menu'));
app.use('/order', cors(corsOptions), OrderMiddleware);

/* For Disabled CORS and Local Devolopment */

// app.use('/order', cors({ origin: 'http://localhost:8100', credentials: true }), OrderMiddleware);

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

/* DDOS Jails */

// grep sshd.\*Failed /var/log/auth.log | less


// import './local_mutations';