import { TransportEmergencyCardCode } from "./TransportEmergencyCardCode";
import { PackingCriteriaCode } from "./PackingCriteriaCode";
import { HazardousRegulationCode } from "./HazardousRegulationCode";
import { InhalationToxicityZoneCode } from "./InhalationToxicityZoneCode";
import { TransportAuthorizationCode } from "./TransportAuthorizationCode";
import { Temperature } from "./Temperature";

/**
 * HazardousGoodsTransit
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface HazardousGoodsTransit {
    /** TransportEmergencyCardCode */
    TransportEmergencyCardCode?: TransportEmergencyCardCode;
    /** PackingCriteriaCode */
    PackingCriteriaCode?: PackingCriteriaCode;
    /** HazardousRegulationCode */
    HazardousRegulationCode?: HazardousRegulationCode;
    /** InhalationToxicityZoneCode */
    InhalationToxicityZoneCode?: InhalationToxicityZoneCode;
    /** TransportAuthorizationCode */
    TransportAuthorizationCode?: TransportAuthorizationCode;
    /** MaximumTemperature */
    MaximumTemperature?: Temperature;
    /** MinimumTemperature */
    MinimumTemperature?: Temperature;
}
