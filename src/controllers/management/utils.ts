import { Request, Response } from "express";
import fetch from "node-fetch";
import request from 'request';
import { DatabaseQueryLimit, ManagementDB } from "../../configrations/database";
import { createLog, LogType } from '../../utils/logger';
import { fstat, readFile, createReadStream } from "fs";
import { accessLogs } from "../../configrations/paths";
import { createInterface } from 'readline'
import { parse } from "node-html-parser";
import axios from "axios";

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

export const getCurrency = (req: Request, res: Response) => {
    const requestedCurrency = req.params.currency;
    axios.get('https://api.genelpara.com/embed/doviz.json').then(ax_res => {
        if (requestedCurrency) {
            res.status(200).json(ax_res.data[requestedCurrency]);
        } else {
            res.status(200).json(ax_res.data);
        }
    }).catch(err => {
        res.status(404).json({ ok: false, message: 'Kur Bilgilerine Ulaşılamıyor' })
    })
}

export const getProhibitionStatus = (req: Request, res: Response) => {
    let tapdkno = req.params.id;
    fetch("http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "upgrade-insecure-requests": "1",
            "cookie": "ASP.NET_SessionId=r3p134fzvhxef2ky4iu4agh3",
            "Referer": "http://212.174.130.210/NewTapdk/ViewApp/sorgu.aspx",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwULLTEwNTEyOTI4MDQPFgQeD0N1cnJlbnRQYWdlRGF0YQIBHg5RdWVyeWZvclNlYXJjaAWgAXNlbGVjdCBST1dfTlVNQkVSKCkgT1ZFUiAoT1JERVIgQlkgSUQgQVNDKSBBUyBSb3cgLCAqIGZyb20gVmlld19WaWV3QXBwX1JlcG9ydDAyICBXaGVyZSBTaWNpbF9ObyBMSUtFICcwMTAxMDU2NVBUJScgQU5EIENPTlZFUlQoSU5ULFNVQlNUUklORyhTaWNpbF9ObywxLDIpKTw5OSAWAgIDD2QWBAIBD2QWAmYPZBYKAgEPZBYEAgEPEA8WAh4LXyFEYXRhQm91bmRnZBAVUghTZcOnaW5pegVBREFOQQhBRElZQU1BTg9BRllPTktBUkFIxLBTQVIFQcSeUkkGQU1BU1lBBkFOS0FSQQdBTlRBTFlBB0FSVFbEsE4FQVlESU4KQkFMSUtFU8SwUglCxLBMRUPEsEsIQsSwTkfDlkwIQsSwVEzEsFMEQk9MVQZCVVJEVVIFQlVSU0EKw4dBTkFLS0FMRQjDh0FOS0lSSQbDh09SVU0JREVOxLBaTMSwC0TEsFlBUkJBS0lSB0VExLBSTkUHRUxBWknEnglFUlrEsE5DQU4HRVJaVVJVTQxFU0vEsMWeRUjEsFIKR0FaxLBBTlRFUAhHxLBSRVNVTgxHw5xNw5zFnkhBTkUISEFLS0FSxLAFSEFUQVkHSVNQQVJUQQdNRVJTxLBOCcSwU1RBTkJVTAfEsFpNxLBSBEtBUlMJS0FTVEFNT05VCEtBWVNFUsSwC0tJUktMQVJFTMSwCktJUsWeRUjEsFIIS09DQUVMxLAFS09OWUEIS8OcVEFIWUEHTUFMQVRZQQdNQU7EsFNBCEsuTUFSQcWeB01BUkTEsE4GTVXEnkxBBE1VxZ4KTkVWxZ5FSMSwUgdOxLDEnkRFBE9SRFUFUsSwWkUHU0FLQVJZQQZTQU1TVU4HU8SwxLBSVAZTxLBOT1AGU8SwVkFTClRFS8SwUkRBxJ4FVE9LQVQHVFJBQlpPTghUVU5DRUzEsArFnkFOTElVUkZBBVXFnkFLA1ZBTgZZT1pHQVQJWk9OR1VMREFLB0FLU0FSQVkHQkFZQlVSVAdLQVJBTUFOCUtJUklLS0FMRQZCQVRNQU4HxZ5JUk5BSwZCQVJUSU4HQVJEQUhBTgZJxJ5ESVIGWUFMT1ZBCEtBUkFCw5xLB0vEsEzEsFMJT1NNQU7EsFlFBkTDnFpDRRVSATABMQEyATMBNAE1ATYBNwE4ATkCMTACMTECMTICMTMCMTQCMTUCMTYCMTcCMTgCMTkCMjACMjECMjICMjMCMjQCMjUCMjYCMjcCMjgCMjkCMzACMzECMzICMzMCMzQCMzUCMzYCMzcCMzgCMzkCNDACNDECNDICNDMCNDQCNDUCNDYCNDcCNDgCNDkCNTACNTECNTICNTMCNTQCNTUCNTYCNTcCNTgCNTkCNjACNjECNjICNjMCNjQCNjUCNjYCNjcCNjgCNjkCNzACNzECNzICNzMCNzQCNzUCNzYCNzcCNzgCNzkCODACODEUKwNSZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZxYBZmQCAw8QDxYCHwJnZBAVAQhTZcOnaW5pehUBATAUKwMBZ2RkAgkPEA8WAh4HVmlzaWJsZWdkZBYBZmQCCw88KwARAwAPFgQfAmceC18hSXRlbUNvdW50AgFkARAWAgICAgYWAjwrAAUBABYCHgpIZWFkZXJUZXh0BQbEsEzDh0U8KwAFAQAWAh8FBRhTQVRJxZ4gWUVSxLBOxLBOIMOcTlZBTkkWAmZmDBQrAAAWAmYPZBYEAgEPZBYUZg8PFgIeBFRleHQFATFkZAIBDw8WAh8GBQVBREFOQWRkAgIPDxYCHwYFBlNFWUhBTmRkAgMPZBYCAgEPDxYCHwYFCjAxMDEwNTY1UFRkZAIEDw8WAh8GBQfFnkVNU8SwZGQCBQ8PFgIfBgUFQUxUSU5kZAIGDw8WAh8GBQZCQUtLQUxkZAIHDw8WAh8GBQZCQUtLQUxkZAIIDw8WAh8GBSFNxLBUSEFUUEHFnkEgTUggNTgyMDAgU09LLk5POjExL0FkZAIJDw8WAh8GBQRGQUFMZGQCAg8PFgIfA2hkZAIND2QWAmYPZBYEZg9kFhwCAQ8PFgIfA2hkZAIDDw8WAh8DaGRkAgUPDxYCHwNoZGQCBw8PFgIfA2hkZAIJDw8WAh8DaGRkAgsPDxYCHwNoZGQCDQ8PFgIfA2hkZAIPDw8WAh8DaGRkAhEPDxYCHwNoZGQCEw8PFgIfA2hkZAIVDw8WAh8DaGRkAhcPDxYCHwNoZGQCGQ8PFgIfA2hkZAIbDw8WAh8DaGRkAgEPZBYCAgEPDxYCHwYFFEzEsFNURURFIFRPUExBTSAgOiAxZGQCDw8PFgIfA2dkZAIFDw9kDxAWAWYWARYCHg5QYXJhbWV0ZXJWYWx1ZQUBMBYBZmRkGAMFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYFBQ1CdXR0b25fU2VhcmNoBRBCdXR0b25fQ2xlYXJGb3JtBQ5CdXR0b25fR29Tb3JndQUPQnV0dG9uX0dvU29yZ3UyBQxCdXR0b25fUHJpbnQFCk11bHRpVmlldzEPD2RmZAUJR3JpZFZpZXcxDzwrAAwBCAIBZDnbkHFnlhobqjnQ0on7C6R%2BVtZ1%2FcrlJCD6bDwhnQQl&__VIEWSTATEGENERATOR=8E9C732A&__EVENTVALIDATION=%2FwEdAHh4mX9dMAs36N%2FqQ3Eu6YJfbWFZL5UKCljsPGnrU%2BqNjJHtctNbVfC9D0kaXTfZK0Iy4TVOBg%2FztRH1Q9DD3BN1ubqyEMS2dyiIsLCoBQC5nyxSdDFryRIv06%2FclkglGGvXxPE4BNT2KEIXfPsgPfeZRz2gixF2734plCuEcKA5dUxLYXn7Lc6LdRUYBh9w%2F9wicrGZhUouCld3VQNMp%2BbJ8yXoxjlcrZiCBuANNI9b7fvhq5i56PSfRcB7DymwoNv%2FFLYPDRy3XnBJ6ZLbWHNHZpP%2BgE%2Bkayf36dXd7jDvdguO3YHabs5nuPco1HvHVjyEYQK0G71qNiz6pbXNNYEI2MS8vbGlsxkFs8VYgrWjZUtUQcKlHN0uhH0HMVVmH94U2Np5L4ucVzrle0scGv01eMVAwgsUmMW3wvdVmSJjL%2BDJRAhQxY9fCqZxh3gTdCICunO%2FNi0FkNrmAIGy0mL8S%2FJS6RVbWsDPMJdG6Bc%2FXyq5H6EHmVBZ3wVHycz3SnZfasmAQ3Zj3pIKi8Rh4yk5QpxYvdjKthTN6fGW5I5T28bGH7ZoRVEnhj8WTRPpbwlVd%2B%2FbjaZIdvll8NVqJpXWInfqGRS%2Fgt3C0RQl3Qr3SYlWVfbDM1RQv1XLK9hbmLFRkTJHvHOZ7HpRsoeS0I7aYykmIhgxZulvEdVu8kHaeYug0u0VVkAdsXWDyMZOCBRstvNdzlkMH88%2BW2iY2OCXbzPnXr6DG9S0VLACDnns04ctR30sdQc93hx7jJJm3dQQh22u7ga7XTMs1F58Nfxn1L%2FLByHdz3THBGLjwX2SOkwNrTeI8eqV71VhYm96KD%2F3XMoFk7LqhuRMbgEJKZdvw924%2FznZY0EDx%2BMPDbdiVGTDLZJoMluIt1ylGEszWVBX0UKFqkrjm0HK3%2BX17J7vvHpXkwWGnCZMh8PtxG503whGGvSN%2F5WUZW6uPbnZ%2B%2Fu0wWald%2BMA6g5NdKwb%2B%2BUkstmXTM3VUcgAzt5bDuPFantNL%2BQDgz%2B6ZG6Pr4pLcDIIXJ%2FCIcye%2Fai0PGP0KwzTvN9deHTBpPuwkRfuelD2KuIs%2BsCTbPQudM4NiISSGpN8EjoviaMs29guSqbmP0198Uj3OD4pKYraaJiQrf%2B3XyQtQJfIOQBLzrUf7CVV42n3FX94cqOI2P9xBmn0l98oV5W9iQ9DPX%2FWqKhyHeyWKvMOTzZcirQQHzhK3CxMelkyUwbCcgOVV9wPA0oM9FDZNMRLTLR4zL%2BOMrcfZJg2DU5GAToXmz8iIYz%2BOj7MvNS3Z5we7q4d%2F7v6ckEkCUSo4SOOsWeS5Hv0WEfss2wvpmpdiMpMYYfgvj1HObK303%2BP8TDZ0pOe4CLQ6tJpl0sEzjXex%2BIKeN9m3Lm8IfM0g6A1DKBRcaCVPHvIyrBXpOUWHnUfpj%2FT6nnvILauHv4q4KvAmOmzPleI1hb5Y4gTQEpQp9SjYi1%2B1yQanv2IVHXsGpRjUxrZEEZ%2FGAzgQVuxHyUIyp%2BE2J%2B6zGG6C4I9Pk%2BmEdRbOTJOIUKLhSp%2B0xdxpryPoSH%2Fwy0mmyi4LaJDI23BROFYlidjrii9PGjOZMQPNfl7ZNXp7%2BiNGHTNb%2ByOBobvK%2BlkLkEPkDNhPX%2FwsvgKgKGKlUPdQJ2wNVzyXZ0sIs7hb%2BGc0wfNtyBfnyv%2FbAZ%2FiFLO62XrDAjD7gqIVVf%2B%2B393ZWiquIRcm5u%2BT3UeELZVlNkVSewDzsVBxEVPtHy7zSBbmKD%2Bkt1NAzBE4ZkmA7gbEhG0dWYDGDx68pdpNgpMJdpe3YTppqgPEape%2BbJqsL6Q3PEGTk58SZMKjb9rYC2OneO0etge%2BJZsjMJ%2BXtKrV1%2B0J8XFpkc5LxMJcxpcQMX7Lb0oJQr6FEqEheWzIqA6TaxjQ1yvAC06yTip9yrp4lBdeZbPT3teUtMO%2FSisnJdN8IWMp%2FquzZ6S4vfl9c3rk59JnxVNMhEEm0hsD9y6zcwOpv5YgG69IfRuuVDfgveo%2BiEhkwfEkKU5g1RA9FB5XlbnfPzZHZ4TjIMQe8xW5jTwirGQycLOpS89t3Ko6xYde08ZMxGEFeAu7Kk4EJLJ1Bc7qH5popFLz8uGTx4sEYMmtQOmvA4J1LHOZ%2FHeRWUsblbxYz3w9fN6G6fIULktwyKM2oSGimdgFUWQmS%2Fc8ctbZ%2B5gIR8MeGe2ZdRbJYAZt5wE2ffMM%2FyhapmOnnDj%2BaZCBQFdztW0ho4LZAofyI%2FYCfCHT65Amja1dkTTHjj%2B%2FiEnVqDDCUe%2FBxKlNg1lNaxtMq4HswFx4PB6h0hf5vQib2AQ%2F%2Fy1yGjHRGCGUtuoEdGzSwMcT7Wb4%2Fd%2FFBoyKpj2JNW9CAHWntDhoKeIzNpoL7rcPrYuoJE3Xgh0JuUTgrY5ysjrQqK2PoVS1LgKds69zqq4X08%2B1oasDkwwGwyS6dMmZ5a70P7ce5cSIl7Ev7etQLPfNc9H%2BlZXXfUo8RbY%2FGkeclQN%2BCzp8VVq5lj%2FvAiVRxXlflrEEVSgoxBTQmDHgqpd4xxfsPZVpTv03pyiUKXbHWmfoCwDtY%2F%2FD9GA77M9R%2BbHWUGQ8CtejxT8cpx69jTTeUjfa9h0AVMP7zAExb%2FcEafUXQ%3D%3D&dd_il=0&dd_ilce=0&TXT_SICIL=${tapdkno}&TXT_TCK=&TXT_UNVAN=&TXT_ADRES=&TXT_vergino=&TXT_AD=&TXT_SOYAD=&TXT_TEL=&dd_tarih=0&dd_islem=-1&Button_Search.x=31&Button_Search.y=9&DropDownList_CountViewGrid=10`,
        "method": "POST"
    }).then(fetchdata => {
        fetchdata.text().then(html => {
            let regexp = new RegExp('Satıcı Bulunamadı.', 'i');
            if (html.search(regexp) == -1) {
                let root = parse(html);
                let table = root.querySelector('#GridView1');
                let data = {
                    company: table.querySelector('td:nth-child(7)').childNodes[0].innerText,
                    city: table.querySelector('td:nth-child(2)').childNodes[0].innerText,
                    district: table.querySelector('td:nth-child(3)').childNodes[0].innerText,
                    address: table.querySelector('td:nth-child(9)').childNodes[0].innerText,
                    type: table.querySelector('td:nth-child(8)').childNodes[0].innerText,
                    status: table.querySelector('td:nth-child(10)').childNodes[0].innerText
                }
                if (data.status == 'FAAL') {
                    console.log()
                    res.status(200).json({ ok: true, message: 'TAPDK Numarası FAAL', details: data })
                } else {
                    res.status(404).json({ ok: false, message: 'TAPDK Numarası ' + data.status })
                }
            } else {
                res.status(404).json({ ok: false, message: 'TAPDK Numarası Yanlış ve Kayıtlı İşletme Yok' })
            }
        })
    })
}

