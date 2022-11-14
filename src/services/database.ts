import { ManagementDB, StoresDB, StoreDB, MenuDB, RemoteDB } from '../configrations/database';

export const initializeMenu = async () => {
    console.log('initializeMenu Service Started: InMemory Menu Database Initializing...')
    try {
        const Database = (await ManagementDB.Databases.find({ selector: { codename: 'CouchRadore' } })).docs[0];
        const RemoteMenuDatabase = RemoteDB(Database, 'quickly-menu-app');
        await MenuDB.Local.replicate.from(RemoteMenuDatabase)
            .on('complete', (listener) => {
                console.log('Local Menu Database Initialized....')
                MenuDB.Memory.sync(MenuDB.Local).on('complete', (listener) => {
                    console.log('InMemory Menu Database Initialized....')
                })
            })
    } catch (error) {
        console.log(error);
    }

}