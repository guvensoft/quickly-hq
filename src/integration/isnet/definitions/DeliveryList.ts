import { Delivery } from "./Delivery";

/**
 * DeliveryList
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface DeliveryList {
    /** Delivery[] */
    Delivery?: Array<Delivery>;
}
