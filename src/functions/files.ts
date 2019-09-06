
import { exists,readFile } from 'fs';

export const readJsonFile = (file_path: string) => {
    return new Promise((resolve, reject) => {
        exists(file_path, (exists) => {
            if (exists) {
                readFile(file_path, (err, data) => {
                    if (!err) {
                        let buffer = data.toString('utf8');
                        let json_data = JSON.parse(buffer);
                        resolve(json_data);
                    } else {
                        reject('Dosya Okunurken Hata Oluştu.');
                    }
                });
            } else {
                reject('Dosya Bulunamadı');
            }
        });
    });
}