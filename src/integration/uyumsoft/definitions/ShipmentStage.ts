import { Id } from "./Id";
import { TransportModeCode } from "./TransportModeCode";
import { TransportMeansTypeCode } from "./TransportMeansTypeCode";
import { TransitDirectionCode } from "./TransitDirectionCode";
import { InvoicePeriod } from "./InvoicePeriod";
import { TransportMeans } from "./TransportMeans";
import { Person } from "./Person";

/**
 * ShipmentStage
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface ShipmentStage {
    /** ID */
    ID?: Id;
    /** TransportModeCode */
    TransportModeCode?: TransportModeCode;
    /** TransportMeansTypeCode */
    TransportMeansTypeCode?: TransportMeansTypeCode;
    /** TransitDirectionCode */
    TransitDirectionCode?: TransitDirectionCode;
    /** xs:string */
    Instructions?: string;
    /** TransitPeriod */
    TransitPeriod?: InvoicePeriod;
    /** TransportMeans */
    TransportMeans?: TransportMeans;
    /** DriverPerson[] */
    DriverPerson?: Array<Person>;
}
