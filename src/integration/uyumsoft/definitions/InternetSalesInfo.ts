import { ShipmentInfo } from "./ShipmentInfo";

/**
 * InternetSalesInfo
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface InternetSalesInfo {
    /** xs:string */
    WebAddress?: string;
    /** xs:string */
    PaymentMidierName?: string;
    /** xs:string */
    PaymentType?: string;
    /** xs:dateTime */
    PaymentDate?: string;
    /** ShipmentInfo */
    ShipmentInfo?: ShipmentInfo;
}
