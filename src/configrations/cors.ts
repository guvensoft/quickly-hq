import { CorsOptions } from 'cors';

const whitelist = [
    'http://mn.quickly.com.tr',
    'https://qr.quickly.com.tr',
    'https://manage.quickly.com.tr'
];

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
    credentials: true,

}