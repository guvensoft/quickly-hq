
/**
 * Customer
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Customer {
    /** xs:string */
    Name?: string;
    /** xs:string */
    VkTckNo?: string;
    /** xs:string */
    RegisterNumber?: string;
    /** xs:string */
    MersisNo?: string;
    /** CustomerType|xs:string|Enterprise,Person */
    TypeEnum?: string;
    /** xs:string */
    TaxOffice?: string;
    /** CustomerOwnerType|xs:string|Government,Private */
    OwnerTypeEnum?: string;
    /** xs:string */
    WebSite?: string;
    /** xs:string */
    AddressCountry?: string;
    /** xs:string */
    AddressCity?: string;
    /** xs:string */
    AddressSubDivisionName?: string;
    /** xs:string */
    AddressStreetName?: string;
    /** xs:string */
    AddressStreetName2?: string;
    /** xs:string */
    AddressBuildingName?: string;
    /** xs:string */
    AddressBuildingNumber?: string;
    /** xs:string */
    AddressRoom?: string;
    /** xs:string */
    AddressPostalZone?: string;
    /** xs:string */
    AddressRegion?: string;
    /** xs:string */
    Surname?: string;
    /** xs:string */
    MiddleName?: string;
    /** xs:string */
    NameSuffix?: string;
    /** xs:string */
    Title?: string;
    /** xs:string */
    ContactName?: string;
    /** xs:string */
    ContactPhone?: string;
    /** xs:string */
    ContactEmail?: string;
    /** xs:int */
    ParentCustomer?: string;
    /** xs:int */
    SourceType?: string;
    /** CustomerSourceType|xs:string|Default,eBelge,Hepsiburada */
    SourceTypeEnum?: string;
}
