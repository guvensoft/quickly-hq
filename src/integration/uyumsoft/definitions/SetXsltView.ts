
/** SetXsltView */
export interface SetXsltView {
    /** XsltViewType|xs:string|Invoice,AproveInvoice,CancelInvoice,eArchiveDefaultInvoice,eArchiveInternetSalesInvoice,EmailBody,Ticket,PassengerList,eDespatch,eReceiptAdvice,Voucher,CancelEmailBody,XmlToUblTransformator,VoucherEmailBody,VoucherCancelEmailBody,ProducerReceipt,InboxInvoiceEmailBody,ProducerReceiptEmailBody,ProducerReceiptCancelEmailBody,SmsBody,OutboxDespatchEmailBody,OutboxDespatchCancelEmailBody,InboxDespatchEmailBody,ReconciliationRecordMail,GuestCheck,ForeignExchangeSale,ForeignExchangeBuy */
    type?: string;
    /** xs:string */
    fileContent?: string;
}
