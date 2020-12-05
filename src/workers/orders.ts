import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'


export const ListenOrder = (OrderDB: PouchDB.Database, StoreDB: PouchDB.Database, CheckID: string) => {

    if (isMainThread) {

        const worker = new Worker(__filename, { workerData: {} });

        worker.on('message', (message: any) => {
            console.log(message);
        });

        worker.on('error', (error) => {
            console.log('Worker Error', error);
        });

        worker.on('online', (info) => {
            console.log('Worker Online');
        })

        worker.on('exit', (code) => {
            if (code !== 0)
                console.log(`Logs Worker stopped with exit code ${code}`);
        });

        worker.postMessage('Hello, world!');

    } else {
        parentPort.once('message', (message) => {
            parentPort.postMessage('Çalışıyorrr');
            OrderDB.changes({ since: 'now', live: true }).on('change', (event) => {
                // console.log(StoreID, CheckID, event.changes);
                parentPort.postMessage(event.changes);
            });
        });


    }

}

