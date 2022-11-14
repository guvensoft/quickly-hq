
/**
 * Value
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Value13 {
    /** xs:base64Binary */
    Envelope?: string;
    /** EnvelopeStatus|xs:string|NoEnvelope,Preparing,EnvelopIsQueued,EnvelopIsProcessing,FileIsNotZip,InvalidEnvelopIdLength,EnvelopCouldNotCopiedFromArchive,CouldNotOpenZip,ZipIsEmpty,FileIsNotXml,EnvelopeIdAndXmlNameMustBeSame,CouldNotParseDocument,EnvelopeIdNotFound,EnvelopeIdAndZipNameMustBeSame,InvalidVersion,SchematronCheckFailed,XmlSchemaCheckFailed,CouldNotTakeTcknVknForSigner,CouldNotSaveSigniture,EnvelopeIdIsAlreadyUsed,EnvelopeContainsIdIsAlreadyUsed,CouldNotCheckPermission,DoesNotHaveSenderUnitPermission,DoesNotHavePostBoxPermission,CouldNotCheckSignPermission,SignerHasNoPermission,IllegalSign,CouldNotCheckAddress,AddressNotFound,DoesNotHaveEntegratorApplication,CouldNotPrepareSystemResponse,SystemError,EnvelopedProcessSuccessfully,CouldNotSendDocumentToTheAddress,DocumentSendingFailedWillNotRetry,TargetDoesNotSendSystemResponse,TargetSendFailedSystemResponse,InvoiceLinkedToCancel,CompletedSuccessfully,CouldNotFindEnvelopeId */
    Status?: string;
    /** xs:int */
    StatusCode?: string;
}
