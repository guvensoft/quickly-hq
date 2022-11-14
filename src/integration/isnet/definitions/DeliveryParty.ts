import { PostalAddress } from "./PostalAddress";

/**
 * DeliveryParty
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface DeliveryParty {
    /** xs:string */
    PartyName?: string;
    /** xs:string */
    PartyTaxCode?: string;
    /** PostalAddress */
    PostalAddress?: PostalAddress;
}
