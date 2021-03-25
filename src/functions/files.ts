import { exists, readFile, writeFile, readdir } from 'fs';

export const readJsonFile = (file_path: string): Promise<any> => {
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

export const writeJsonFile = (file_path: string, data: any) => {
    return new Promise<boolean>((resolve, reject) => {
        const Data = JSON.stringify(data);
        writeFile(file_path, Data, (err) => {
            if (!err) {
                resolve(true);
            } else {
                reject('Dosya Yazılırken Hata Oluştu.' + err);
            }
        })
    });
}


export const readDirectory = (directory_path: string) => {
    return new Promise<string[]>((resolve, reject) => {
        readdir(directory_path, (err, files) => {
            if (!err) {
                resolve(files);
            } else {
                reject(false)
            }
        })
    })
}