
/**
 * ExportReceiver
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ExportReceiver {
    /** xs:string */
    BoulevardAveneuStreetName?: string;
    /** xs:string */
    BuildingNumber?: string;
    /** xs:string */
    CityName?: string;
    /** xs:string */
    CountryName?: string;
    /** xs:string */
    ExternalReceiverCode?: string;
    /** xs:string */
    OfficialReceiverName?: string;
    /** xs:string */
    PostalCode?: string;
    /** xs:string */
    ReceiverName?: string;
    /** xs:string */
    ReceiverTaxCode?: string;
    /** q4:ReceiverType */
    ReceiverType?: string;
    /** xs:string */
    TownName?: string;
}
