import { Carier } from "./Carier";

/**
 * ShipmentInfo
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface ShipmentInfo {
    /** xs:dateTime */
    SendDate?: string;
    /** Carier */
    Carier?: Carier;
}
