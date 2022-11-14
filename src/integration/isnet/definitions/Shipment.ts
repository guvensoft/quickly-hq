import { ShipmentPackageList } from "./ShipmentPackageList";
import { ShipmentStageList } from "./ShipmentStageList";
import { ShipmentTransportMeansList } from "./ShipmentTransportMeansList";

/**
 * Shipment
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Shipment {
    /** xs:string */
    GrossVolumeMeasure?: string;
    /** xs:string */
    GrossVolumeMeasureUnitCode?: string;
    /** xs:string */
    GrossWeightMeasure?: string;
    /** xs:string */
    GrossWeightMeasureUnitCode?: string;
    /** q3:ArrayOfstring */
    GtipNoList?: string;
    /** ShipmentPackageList */
    ShipmentPackageList?: ShipmentPackageList;
    /** ShipmentStageList */
    ShipmentStageList?: ShipmentStageList;
    /** ShipmentTransportMeansList */
    ShipmentTransportMeansList?: ShipmentTransportMeansList;
}
