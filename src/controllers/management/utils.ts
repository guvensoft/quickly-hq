import { Request, Response } from "express";
import fetch from "node-fetch";
import request from 'request';
import { DatabaseQueryLimit, ManagementDB } from "../../configrations/database";
import { createLog, LogType } from '../../utils/logger';
import { fstat, readFile, createReadStream } from "fs";
import { accessLogs } from "../../configrations/paths";
import { createInterface } from 'readline'

export const getImage = (req: Request, res: Response) => {

    // q={searchTerms}
    // num={count?}
    // start={startIndex?}
    // lr={language?}
    // safe={safe?}
    // cx={cx?}
    // sort={sort?}
    // filter={filter?}
    // gl={gl?}
    // cr={cr?}
    // googlehost={googleHost?}
    // c2coff={disableCnTwTranslation?}
    // hq={hq?}
    // hl={hl?}
    // siteSearch={siteSearch?}
    // siteSearchFilter={siteSearchFilter?}

    // exactTerms={exactTerms?}
    // excludeTerms={excludeTerms?}
    // linkSite={linkSite?}
    // orTerms={orTerms?}
    // relatedSite={relatedSite?}
    // dateRestrict={dateRestrict?}
    // lowRange={lowRange?}
    // highRange={highRange?}
    // searchType={searchType}
    // fileType={fileType?}
    // rights={rights?}
    // imgSize={imgSize?}
    // imgType={imgType?}
    // imgColorType={imgColorType?}
    // imgDominantColor={imgDominantColor?}

    let text: string = req.params.text.toLowerCase().replace(' ', '+').replace('ı', 'i').replace('ş', 's').replace('ğ', 'g').replace('ö', 'o').replace('ç', 'c');
    text = encodeURI(text);
    const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyARrB06rfYxEDUjqPlrQcPt0SilKXiooOQ&cx=007294214063143114304:5yl4tp9fpvo&q=${text}&searchType=image&fileType=png,jpg&lr=lang_tr&imgSize=xxlarge`;
    fetch(url).then(g_res => {
        g_res.json().then((j_res: any) => {
            let data = j_res.items.map(({ link }) => link);
            res.json(data);
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
}

export const getVenues = (req: Request, res: Response) => {
    let text: string = req.params.text.toLowerCase().replace(' ', '+').replace('ı', 'i').replace('ş', 's').replace('ğ', 'g').replace('ö', 'o').replace('ç', 'c');
    text = encodeURI(text);
    request({
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        qs: {
            client_id: 'UVMWY3IGPHDTIHBOXRNDWDWZWNL1BM5JHC0YJWUO3RWNGXEI',
            client_secret: 'BXNV2440BYTQYTXJHMFLWBTHVEVFEUURK2BA3OAT5F0XNXB0',
            // ll: '40.7243,-74.0018',
            near: 'Istanbul',
            categoryId: '4d4b7105d754a06374d81259,4d4b7105d754a06376d81259',
            query: text,
            v: '20180323',
            limit: 5
        }
    }, function (err, response, body) {
        if (err) {
            console.error(err);
        } else {

            // res.json(JSON.parse(body));
            // request({
            //     uri: 'https://api.foursquare.com/v2/venues/54a5a527498eb4b58d8e0864/photos',
            //     method: 'GET',
            //     qs: {
            //         client_id: 'UVMWY3IGPHDTIHBOXRNDWDWZWNL1BM5JHC0YJWUO3RWNGXEI',
            //         client_secret: 'BXNV2440BYTQYTXJHMFLWBTHVEVFEUURK2BA3OAT5F0XNXB0',
            //         v: '20180323',
            //         limit: 10
            //     }
            // }, (err, response, body) => {
            //     res.json(JSON.parse(body));
            // })

        }
    });
}

export const getErrorLogs = (req: Request, res: Response) => {
    let qLimit = req.query.limit || DatabaseQueryLimit;
    let qSkip = req.query.skip || 0;
    delete req.query.skip;
    delete req.query.limit;
    ManagementDB.Logs.find({ selector: req.query, limit: qLimit, skip: qSkip }).then((obj: any) => {
        res.send(obj.docs);
    }).catch((err) => {
        res.status(404).json({ ok: false, message: 'Loglar Bulunamadı!' });
        createLog(req, LogType.DATABASE_ERROR, err);
    });
}

export const getMemoryUsage = (req: Request, res: Response) => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    res.json({ ok: true, type: 'Memory', usage: `${Math.round(used * 100) / 100} MB` });
}

export const getAccessLogs = (req: Request, res: Response) => {
    let logs = [];
    const readInterface = createInterface({
        input: createReadStream(accessLogs),
    });
    readInterface.on('line', function (line) {
        logs.push(line);
    });
    readInterface.on('close', function (line) {
        res.json(logs);
    });
}

