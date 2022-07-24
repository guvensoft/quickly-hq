import * as blackboard from './blackboard';

// https://qr.disoo.co/qr/601715

/* For Testing New Functions */

// sendNotifications().then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err);
// })
// blackboard.makeProforma()
// blackboard.addProperty()
// blackboard.updateStoreDetail(); 
// blackboard.Fixer('kosmos-besiktas')
// blackboard.fixTables('haora-cafe')
// blackboard.invoiceReader()
// blackboard.makePdf('3f5fd0e5-6393-41b2-8df9-a91edd788751',1641030909000,1643709309000)
// blackboard.allOrders('kosmos-besiktas','9b3a6069-427e-4bb0-b9a6-1175078e7df6');
// blackboard.allRevisions('kosmos-besiktas','9b3a6069-427e-4bb0-b9a6-1175078e7df6')
// exportReportFromDaysData('3f5fd0e5-6393-41b2-8df9-a91edd788751','1643709309000','1643709309000')
// blackboard.updateStoreDetail()
// blackboard.fixTables('kallavi-marmaraforum');
// blackboard.updateTerminalWithMenu('d675d07a-671a-4623-b953-6bf0e55745a1')
// blackboard.clearOrders('9bc2c532-634e-433e-ba97-224fdf4fa0d5')
// dailyStockExpense()
// clearStoreDatabase('22d9fc30-e497-48eb-a9e8-484ac50e5d57').then(isOk => {
//     console.log(isOk)
// }).catch(err => {
//     console.log(err);
// })
// blackboard.menuToTerminal2('d8412bb0-5546-4b78-922e-b7a774daa217')
// blackboard.clearOrders('294959af-eda3-4196-83db-b9886e4d66e3')
// blackboard.Fixer('kallavi-besiktas')
// blackboard.makeProforma()
// blackboard.clearStoreProducts('3f5fd0e5-6393-41b2-8df9-a91edd788751')
// blackboard.documentTransport('kallavi-besiktas','kallavi-marmaraforum',{db_name:'products'},'update');
// blackboard.fixTables('kallavi-marmaraforum')
// blackboard.findDuplicates('294959af-eda3-4196-83db-b9886e4d66e3')
// blackboard.menuToTerminal2('5d1fde38-459b-4b36-811a-d43fa4146aa3')
// blackboard.clearOrders('3f5fd0e5-6393-41b2-8df9-a91edd788751')
// clearStoreDatabase('3f5fd0e5-6393-41b2-8df9-a91edd788751').then(isOk => {
//     console.log(isOk)
// }).catch(err => {
//     console.log(err);
// })
// blackboard.menuToTerminal2('e61fa1f8-4bb6-4658-b782-efdea1b6d557')
// blackboard.storeDays('22d9fc30-e497-48eb-a9e8-484ac50e5d57','1646148108000','1647357708000');
// blackboard.allOrders('kosmos-besiktas','37da827c-45f8-4679-96c6-b8f3a879e18c')
// blackboard.clearOrders('3f5fd0e5-6393-41b2-8df9-a91edd788751');
// blackboard.Fixer('haora-cafe')
// blackboard.fixTables('haora-cafe')
// blackboard.makeProforma()
// blackboard.invoiceReader();
// blackboard.storeDays('d675d07a-671a-4623-b953-6bf0e55745a1','1640995218000','1643673618000')
// blackboard.storeDays('d675d07a-671a-4623-b953-6bf0e55745a1','1643673618000','1646092818000')
// blackboard.storeDays('2275d56d-b704-4d96-a8f9-4b2d8ecfa52d','1646092818000','1648771218000')
// blackboard.allOrders('kosmos-besiktas','6cebba49-09bf-4cfb-adba-6a97123bc228')
// blackboard.allRevisions('kosmos-besiktas','6cebba49-09bf-4cfb-adba-6a97123bc228')
// blackboard.menuToTerminal2('cb3a996a-2bd2-42f6-9b5f-801c5b4138a7')
// blackboard.fixTables('kosmos-besiktas')
// blackboard.storeDays('9bc2c532-634e-433e-ba97-224fdf4fa0d5','1646120636000','1648799036000');
// blackboard.MoveData('ornek-menu','eleven-brothers',{db_name:'cashbox_categories'})
// blackboard.clearOrders('3f5fd0e5-6393-41b2-8df9-a91edd788751');
// blackboard.allRevisions('eleven-bothers','350e0e9c04f4fb5a2e0a544515072fdf')
// blackboard.BackupReportGenerator()
// blackboard.storeDays('f93c9160-64e2-4f52-a732-1acd35f0dc46','1633813200000','1649789507527')
// blackboard.productReports('f93c9160-64e2-4f52-a732-1acd35f0dc46','1633889117000','1636589117000')
// /store/reports/sales/1633813200000/1649789507527
// blackboard.clearOrders('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.clearStoreProducts('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.clearDatabase('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.backupStoreDatabase('d675d07a-671a-4623-b953-6bf0e55745a1');
// blackboard.clearStoreProducts('d675d07a-671a-4623-b953-6bf0e55745a1')
// blackboard.menuToTerminal2('d675d07a-671a-4623-b953-6bf0e55745a1')
// blackboard.loadStoreBackup('9bc2c532-634e-433e-ba97-224fdf4fa0d5','tables')
// blackboard.clearDatabase('22d9fc30-e497-48eb-a9e8-484ac50e5d57')
// blackboard.clearStoreProducts('9bc2c532-634e-433e-ba97-224fdf4fa0d5')
// blackboard.MoveData()
// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'products'},'fetch');
// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'categories'},'fetch');
// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'sub_categories'},'fetch');
// blackboard.documentTransport('kallavi-marmaraforum','kallavi-besiktas',{db_name:'reports', type:'Product'},'fetch');
// blackboard.storeProductSales('d675d07a-671a-4623-b953-6bf0e55745a1','1648802856000','1651394856000')
// blackboard.storeDays('9bc2c532-634e-433e-ba97-224fdf4fa0d5','1641025530000','1643703930000')
// blackboard.Fixer('haora-cafe')
// blackboard.fixTables('kallavi-marmaraforum');
// blackboard.storeDays('2275d56d-b704-4d96-a8f9-4b2d8ecfa52d','1648771230000','1651398377000')
// blackboard.storeProductSales('2275d56d-b704-4d96-a8f9-4b2d8ecfa52d','1648771230000','1651398377000')
// blackboard.Fixer('')
// blackboard.fixTables('haora-cafe')
// blackboard.Fixer('haora-cafe')
// blackboard.documentTransport('kallavi-besiktas','kallavi-marmaraforum',{db_name:'products'},'update');
// blackboard.getSessions();
// blackboard.clearDatabase('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.storeDays('9bc2c532-634e-433e-ba97-224fdf4fa0d5','1651390945000','1654069345000')
// blackboard.allRevisions('quickly-menu-app','kazan-besiktas');
// gsNJKyASUYv7pA!
// http://pigetrzlperjreyr3fbytm27bljaq4eungv3gdq2tohnoyfrqu4bx5qd.onion/bt2067f91702c7008f1afccdc64cd22527fe963f6f0d2edbdd36c7776726012a26d61d34de45cf487897beb168cac81dc6c98980a2e8796562c7bdc98930b5a857ea7b01b5b38a663621e3787c517d5bb8f2a518fe6033e02f3add58c6e0947482472ae75c4ec616bec69be8007d5e58a900115ecc3faea6db7706cf80d9ecd9d577/
// blackboard.updateStoreDetail();
// blackboard.updateStoresDetails();
// blackboard.recrateDatabase('22d9fc30-e497-48eb-a9e8-484ac50e5d57')
// blackboard.clearDatabase('22d9fc30-e497-48eb-a9e8-484ac50e5d57')
// blackboard.recreateAllStoreDB();
// blackboard.clearOrders('22d9fc30-e497-48eb-a9e8-484ac50e5d57')
// blackboard.allOrders('haora-cafe','e6224bdd-5fa2-438c-ab33-4aafbd4b11fb');
// blackboard.allRevisions('kosmos-besiktas','f989e468-2ca2-4e79-badd-812af718d684');
// blackboard.Fixer('haora-cafe')
// blackboard.menuToTerminal2('e5a5c0cd-97c3-4c36-ba05-7f9a0ceb519d')
// blackboard.replaceProductsName('e5a5c0cd-97c3-4c36-ba05-7f9a0ceb519d')
// blackboard.storeDays('e5a5c0cd-97c3-4c36-ba05-7f9a0ceb519d','1656719229437')
// blackboard.storeDays('e5a5c0cd-97c3-4c36-ba05-7f9a0ceb519d','1656719229437','1656858505000')
// blackboard.storeProductSales('e5a5c0cd-97c3-4c36-ba05-7f9a0ceb519d','1656719229437','1656858505000')
// blackboard.addNotes()
// blackboard.loadStoreBackup('22d9fc30-e497-48eb-a9e8-484ac50e5d57','tables')
// blackboard.storeProductExport('e5a5c0cd-97c3-4c36-ba05-7f9a0ceb519d')
// blackboard.clearDatabase('d622f9dd-036b-4775-bbee-911d301c5b77')
// blackboard.importFromBackup('d622f9dd-036b-4775-bbee-911d301c5b77')
