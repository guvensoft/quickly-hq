import { CurrencyInvoices } from "./CurrencyInvoices";

/**
 * request
 * @targetNSAlias `q9`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Request3 {
    /** xs:string */
    CompanyTaxCode?: string;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** CurrencyInvoices */
    CurrencyInvoices?: CurrencyInvoices;
}
