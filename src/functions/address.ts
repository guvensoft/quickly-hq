import { readJsonFile } from './files';
import { addressesPath } from '../configrations/paths';
import { AdressDB } from '../configrations/database';

export const importAdress = () => {
    readJsonFile(addressesPath + 'street.json').then((json: Array<any>) => {
        let districts = json.map(obj => {
            delete obj.id;
            return obj;
        })
        console.log(districts.length);
        for (let index = 0; index < districts.length; index++) {
            AdressDB.Streets.post(districts[index]).then(res => {
                console.log(index, 'Done!')
            }).catch(err => {
                console.error(index, 'Not Added TO DB cux:', err);
            });
        }
    }).catch(err => {
        console.log('File Read Error..')
    })
}

export const getCities = () => {
    AdressDB.Streets.find({ selector: { parent: '40218' }, limit: 1000 }).then(res => {
        console.log(res.docs);
    })
}

export const createIndexesForDatabase = () => {
    let indexObj: PouchDB.Find.CreateIndexOptions = {
        index: {
            fields: ['parent'],
        },
    }
    AdressDB.Streets.createIndex(indexObj).then(res => { console.log(res) })
}