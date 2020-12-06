import { CorsOptions } from 'cors';

const whitelist = [
    'https://qr.quickly.com.tr',
    'https://manage.quickly.com.tr'
];

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}