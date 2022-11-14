import { CompanyBranchAddress } from "./CompanyBranchAddress";

/**
 * Receiver
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Receiver {
    /** Address */
    Address?: CompanyBranchAddress;
    /** xs:string */
    ExternalReceiverCode?: string;
    /** xs:string */
    InstallationNumber?: string;
    /** xs:string */
    ReceiverName?: string;
    /** xs:string */
    ReceiverTaxCode?: string;
    /** q6:RecipientType */
    RecipientType?: string;
    /** q7:SendingType */
    SendingType?: string;
    /** xs:string */
    VendorNumber?: string;
}
