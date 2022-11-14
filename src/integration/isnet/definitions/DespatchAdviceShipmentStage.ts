import { DriverPersonList } from "./DriverPersonList";
import { ShipmentTransportMeans } from "./ShipmentTransportMeans";

/**
 * DespatchAdviceShipmentStage
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface DespatchAdviceShipmentStage {
    /** DriverPersonList */
    DriverPersonList?: DriverPersonList;
    /** ShipmentTransportMeans */
    ShipmentTransportMeans?: ShipmentTransportMeans;
}
