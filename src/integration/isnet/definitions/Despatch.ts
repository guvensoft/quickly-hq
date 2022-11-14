import { DeliveryParty } from "./DeliveryParty";

/**
 * Despatch
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Despatch {
    /** DespatchParty */
    DespatchParty?: DeliveryParty;
}
