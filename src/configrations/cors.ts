import { CorsOptions } from 'cors';
import { response } from 'express';

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
            response.send("Eyes on you..!");
        }
    },
    credentials: true,

}