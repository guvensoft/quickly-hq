import { NextFunction, Request, Response } from 'express';
import * as axios from 'axios';
import { ReCaptchaSecret } from '../configrations/secrets';

export const ReCaptchaCheck = (req: Request, res: Response, next: NextFunction) => {
    let urlEncodedData = 'secret=' + ReCaptchaSecret + '&response=' + req.body.captchaResponse + '&remoteip=' + req.connection.remoteAddress;
    axios.default.post('https://www.google.com/recaptcha/api/siteverify', urlEncodedData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((axio_res) => {
        if (axio_res.data.success) {
            next();
        } else {
            res.status(401).send({ message: 'No bots!' });
        }
    }).catch((err) => {
        console.log(err);
        res.status(401).send({ message: 'No bots!' });
    });
}