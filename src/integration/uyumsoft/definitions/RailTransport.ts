import { TrainId } from "./TrainId";
import { RailCarId } from "./RailCarId";

/**
 * RailTransport
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface RailTransport {
    /** TrainID */
    TrainID?: TrainId;
    /** RailCarID */
    RailCarID?: RailCarId;
}
