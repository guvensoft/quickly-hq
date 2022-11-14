import { Delivery1 } from "./Delivery1";
import { ShipmentStageList1 } from "./ShipmentStageList1";

/**
 * Shipment
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Shipment1 {
    /** Delivery */
    Delivery?: Delivery1;
    /** ShipmentStageList */
    ShipmentStageList?: ShipmentStageList1;
    /** xs:decimal */
    TotalValueAmount?: string;
    /** q43:ArrayOfstring */
    TransportEquipmentPlateList?: string;
}
