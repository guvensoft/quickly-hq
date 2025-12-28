import path from 'path';

export const ACCESS_LOGS = path.join(__dirname, '../', 'access.log');
export const DATABASE_PATH = path.join(__dirname, '../..', '/db/');
export const BACKUP_PATH = path.join(__dirname, '../..', '/backup/');
export const DOCUMENTS_PATH = path.join(__dirname, '../..', '/documents/');
export const ADDRESES_PATH = path.join(__dirname, '../..', '/address/');
export const APN_AUTHKEY_PATH = path.join(__dirname, '../..', '/certificates/AuthKey_788GCC9YS7.p8')

export const CDN_MENU_PATH = '/var/www/cdn.quickly.com.tr/quickly-menu/';

// E Invoice Integration Paths
export const UYUMSOFT_WSDL_URL = "https://efatura-test.uyumsoft.com.tr/Services/Integration?wsdl";
export const UYUMSOFT_WSDL_PATH = path.join(__dirname, '../src/integration/uyumsoft.wsdl');

export const ISNET_WSDL_URL = "http://einvoiceservicetest.isnet.net.tr/InvoiceService/ServiceContract/InvoiceService.svc?singleWsdl";
export const ISNET_WSDL_PATH = path.join(__dirname, '../', 'integration/isnet.wsdl');