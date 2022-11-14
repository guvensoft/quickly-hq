import { Receiver } from "./Receiver";

/**
 * Delivery
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Delivery1 {
    /** xs:dateTime */
    ActualDespatchDate?: string;
    /** CarrierParty */
    CarrierParty?: Receiver;
}
