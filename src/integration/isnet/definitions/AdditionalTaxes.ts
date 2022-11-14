import { Tax } from "./Tax";

/**
 * AdditionalTaxes
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface AdditionalTaxes {
    /** Tax[] */
    Tax?: Array<Tax>;
}
