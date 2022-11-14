
/**
 * Company
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Company {
    /** xs:string */
    BranchName?: string;
    /** xs:string */
    BranchNo?: string;
    /** xs:string */
    BusinessDescription?: string;
    /** xs:string */
    Email?: string;
    /** xs:string */
    FaxNumber?: string;
    /** xs:int */
    FiscalYearMonth?: string;
    /** xs:string */
    PhoneNumber?: string;
    /** PhoneType|xs:string|Bookkeeper,Controller,Direct,Fax,InvestorRelations,Main,Switchboard,Other */
    PhoneTypeEnum?: string;
    /** xs:dateTime */
    LedgerStartDate?: string;
    /** xs:int */
    LedgerMasterCounter?: string;
    /** xs:int */
    LedgerDetailCounter?: string;
    /** xs:int */
    LedgerDocumentId?: string;
}
