import { ShipmentStage } from "./ShipmentStage";

/**
 * ShipmentStageList
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ShipmentStageList {
    /** ShipmentStage[] */
    ShipmentStage?: Array<ShipmentStage>;
}
