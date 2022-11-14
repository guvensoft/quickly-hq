import { Delivery2 } from "./Delivery2";

/**
 * Shipment
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Shipment2 {
    /** Delivery */
    Delivery?: Delivery2;
}
