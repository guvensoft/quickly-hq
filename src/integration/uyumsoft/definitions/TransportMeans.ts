import { JourneyId } from "./JourneyId";
import { RegistrationNationalityId } from "./RegistrationNationalityId";
import { DirectionCode } from "./DirectionCode";
import { TransportMeansTypeCode } from "./TransportMeansTypeCode";
import { TradeServiceCode } from "./TradeServiceCode";
import { Stowage } from "./Stowage";
import { AirTransport } from "./AirTransport";
import { RoadTransport } from "./RoadTransport";
import { RailTransport } from "./RailTransport";
import { MaritimeTransport } from "./MaritimeTransport";
import { IssuerParty } from "./IssuerParty";
import { RangeDimension } from "./RangeDimension";

/**
 * TransportMeans
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface TransportMeans {
    /** JourneyID */
    JourneyID?: JourneyId;
    /** RegistrationNationalityID */
    RegistrationNationalityID?: RegistrationNationalityId;
    /** xs:string */
    RegistrationNationality?: string;
    /** DirectionCode */
    DirectionCode?: DirectionCode;
    /** TransportMeansTypeCode */
    TransportMeansTypeCode?: TransportMeansTypeCode;
    /** TradeServiceCode */
    TradeServiceCode?: TradeServiceCode;
    /** Stowage */
    Stowage?: Stowage;
    /** AirTransport */
    AirTransport?: AirTransport;
    /** RoadTransport */
    RoadTransport?: RoadTransport;
    /** RailTransport */
    RailTransport?: RailTransport;
    /** MaritimeTransport */
    MaritimeTransport?: MaritimeTransport;
    /** OwnerParty */
    OwnerParty?: IssuerParty;
    /** MeasurementDimension[] */
    MeasurementDimension?: Array<RangeDimension>;
}
