import { Id } from "./Id";
import { Country } from "./Country";

/**
 * PostalAddress
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface PostalAddress {
    /** ID */
    ID?: Id;
    /** xs:string */
    Postbox?: string;
    /** xs:string */
    Room?: string;
    /** xs:string */
    StreetName?: string;
    /** xs:string */
    BlockName?: string;
    /** xs:string */
    BuildingName?: string;
    /** xs:string */
    BuildingNumber?: string;
    /** xs:string */
    CitySubdivisionName?: string;
    /** xs:string */
    CityName?: string;
    /** xs:string */
    PostalZone?: string;
    /** xs:string */
    Region?: string;
    /** xs:string */
    District?: string;
    /** Country */
    Country?: Country;
}
