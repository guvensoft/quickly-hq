
/**
 * Items
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Items2 {
    /** xs:string */
    InvoiceId?: string;
    /** xs:string */
    DocumentId?: string;
    /** InvoiceTypes|xs:string|BaseInvoice,ComercialInvoice,InvoiceWithPassanger,Export,eArchive,Hks,PublicAdministration */
    Type?: string;
    /** xs:int */
    TypeCode?: string;
    /** xs:string */
    TargetTcknVkn?: string;
    /** xs:string */
    TargetTitle?: string;
    /** xs:string */
    EnvelopeIdentifier?: string;
    /** InvoiceStatus|xs:string|NotPrepared,NotSend,Draft,Canceled,Queued,Processing,SentToGib,Approved,WaitingForAprovement,Declined,Return,EArchivedCanceled,Error */
    Status?: string;
    /** xs:int */
    StatusCode?: string;
    /** EnvelopeStatus|xs:string|NoEnvelope,Preparing,EnvelopIsQueued,EnvelopIsProcessing,FileIsNotZip,InvalidEnvelopIdLength,EnvelopCouldNotCopiedFromArchive,CouldNotOpenZip,ZipIsEmpty,FileIsNotXml,EnvelopeIdAndXmlNameMustBeSame,CouldNotParseDocument,EnvelopeIdNotFound,EnvelopeIdAndZipNameMustBeSame,InvalidVersion,SchematronCheckFailed,XmlSchemaCheckFailed,CouldNotTakeTcknVknForSigner,CouldNotSaveSigniture,EnvelopeIdIsAlreadyUsed,EnvelopeContainsIdIsAlreadyUsed,CouldNotCheckPermission,DoesNotHaveSenderUnitPermission,DoesNotHavePostBoxPermission,CouldNotCheckSignPermission,SignerHasNoPermission,IllegalSign,CouldNotCheckAddress,AddressNotFound,DoesNotHaveEntegratorApplication,CouldNotPrepareSystemResponse,SystemError,EnvelopedProcessSuccessfully,CouldNotSendDocumentToTheAddress,DocumentSendingFailedWillNotRetry,TargetDoesNotSendSystemResponse,TargetSendFailedSystemResponse,InvoiceLinkedToCancel,CompletedSuccessfully,CouldNotFindEnvelopeId */
    EnvelopeStatus?: string;
    /** xs:int */
    EnvelopeStatusCode?: string;
    /** xs:string */
    Message?: string;
    /** xs:dateTime */
    CreateDateUtc?: string;
    /** xs:dateTime */
    ExecutionDate?: string;
    /** xs:decimal */
    PayableAmount?: string;
    /** xs:decimal */
    TaxTotal?: string;
    /** xs:decimal */
    TaxExclusiveAmount?: string;
    /** xs:string */
    DocumentCurrencyCode?: string;
    /** xs:decimal */
    ExchangeRate?: string;
    /** xs:decimal */
    Vat1?: string;
    /** xs:decimal */
    Vat8?: string;
    /** xs:decimal */
    Vat18?: string;
    /** xs:decimal */
    Vat0TaxableAmount?: string;
    /** xs:decimal */
    Vat1TaxableAmount?: string;
    /** xs:decimal */
    Vat8TaxableAmount?: string;
    /** xs:decimal */
    Vat18TaxableAmount?: string;
    /** xs:string */
    OrderDocumentId?: string;
    /** xs:boolean */
    IsArchived?: string;
    /** InvoiceTipType|xs:string|Sales,Return,Tax,Exception,TaxBase,ExportSaved,Sgk,Broker,HksSales,HksBroker,WithholdingReturn */
    InvoiceTipType?: string;
    /** xs:int */
    InvoiceTipTypeCode?: string;
    /** xs:boolean */
    IsNew?: string;
}
