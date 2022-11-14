import { Person } from "./Person";

/**
 * DriverPersonList
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface DriverPersonList {
    /** Person[] */
    Person?: Array<Person>;
}
