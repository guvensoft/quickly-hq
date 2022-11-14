
/**
 * InvoiceExpense
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceExpense {
    /** xs:decimal */
    DeductionPrice?: string;
    /** xs:decimal */
    DeductionRatio?: string;
    /** xs:decimal */
    TaxPrice?: string;
    /** xs:decimal */
    TaxRatio?: string;
    /** ExpenseType|xs:string|Komisyon,Navlun,Hammaliye,Gelir_Vergisi_Tevkifati,Bagkur_Tevkifati,Hal_Rusumu,Tic_Borsası,Milli_Savunma_Fonu,Diger_Masraflar,Nakliye */
    Type?: string;
}
