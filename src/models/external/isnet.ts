export interface ISendInvoiceInput {
    request: {
        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        Invoices: {
            Invoice: InvoiceServiceBasicHttpEndpointTypes.IInvoice[];
        };
    };
}

export interface ISendInvoiceOutput {
    SendInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ISendInvoiceResult;
}

export interface ISendInvoiceApiInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        Invoices: {
            Invoice: InvoiceServiceBasicHttpEndpointTypes.IInvoice[];
        };
    };
}

export interface ISendInvoiceApiOutput {
    SendInvoiceApiResult: InvoiceServiceBasicHttpEndpointTypes.ISendInvoiceApiResult;
}

export interface ISendInvoiceXmlInput {
    request: {
        Invoices: {
            InvoiceXml: InvoiceServiceBasicHttpEndpointTypes.IInvoiceXml[];
        };
    };
}

export interface ISendInvoiceXmlOutput {
    SendInvoiceXmlResult: InvoiceServiceBasicHttpEndpointTypes.ISendInvoiceXmlResult;
}

export interface ISendInvoiceXmlWithoutInvoiceNumberInput {
    request: {
        CompanyVendorNumber: string;
        Invoices: {
            InvoiceXml: InvoiceServiceBasicHttpEndpointTypes.IInvoiceXml[];
        };
    };
}

export interface ISendInvoiceXmlWithoutInvoiceNumberOutput {
    SendInvoiceXmlWithoutInvoiceNumberResult: InvoiceServiceBasicHttpEndpointTypes.ISendInvoiceXmlWithoutInvoiceNumberResult;
}

export interface ISendCurrencyInvoiceInput {
    request: {
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        CurrencyInvoices: InvoiceServiceBasicHttpEndpointTypes.ICurrencyInvoices;
    };
}

export interface ISendCurrencyInvoiceOutput {
    SendCurrencyInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ISendCurrencyInvoiceResult;
}

export interface ISendCurrencyInvoiceApiInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        CurrencyInvoices: InvoiceServiceBasicHttpEndpointTypes.ICurrencyInvoices;
    };
}

export interface ISendCurrencyInvoiceApiOutput {
    SendCurrencyInvoiceApiResult: InvoiceServiceBasicHttpEndpointTypes.ISendCurrencyInvoiceApiResult;
}

export interface ISendArchiveInvoiceInput {
    request: {
        ArchiveInvoices: {
            ArchiveInvoice: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoice[];
        };

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
    };
}

export interface ISendArchiveInvoiceOutput {
    SendArchiveInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ISendArchiveInvoiceResult;
}

export interface ISendArchiveInvoiceApiInput {
    request: {
        ArchiveInvoices: {
            ArchiveInvoice: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoice[];
        };

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
    };
}

export interface ISendArchiveInvoiceApiOutput {
    SendArchiveInvoiceApiResult: InvoiceServiceBasicHttpEndpointTypes.ISendArchiveInvoiceApiResult;
}

export interface ISendArchiveInvoiceXmlInput {
    request: {
        ArchiveInvoices: {
            ArchiveInvoiceXml: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceXml[];
        };
    };
}

export interface ISendArchiveInvoiceXmlOutput {
    SendArchiveInvoiceXmlResult: InvoiceServiceBasicHttpEndpointTypes.ISendArchiveInvoiceXmlResult;
}

export interface ISendArchiveInvoiceXmlWithoutInvoiceNumberInput {
    request: {
        ArchiveInvoices: {
            ArchiveInvoiceXml: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceXml[];
        };

        CompanyVendorNumber: string;
    };
}

export interface ISendArchiveInvoiceXmlWithoutInvoiceNumberOutput {
    SendArchiveInvoiceXmlWithoutInvoiceNumberResult: InvoiceServiceBasicHttpEndpointTypes.ISendArchiveInvoiceXmlWithoutInvoiceNumberResult;
}

export interface ISendInvoiceReplyInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        InvoiceReplies: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReplies;
    };
}

export interface ISendInvoiceReplyOutput {
    SendInvoiceReplyResult: InvoiceServiceBasicHttpEndpointTypes.ISendInvoiceReplyResult;
}

export interface IUpdateInvoiceStateInput {
    request: {
        BaseInvoiceReplies: InvoiceServiceBasicHttpEndpointTypes.IBaseInvoiceReplies;

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
    };
}

export interface IUpdateInvoiceStateOutput {
    UpdateInvoiceStateResult: InvoiceServiceBasicHttpEndpointTypes.IUpdateInvoiceStateResult;
}

export interface IDirectInvoiceInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        InvoiceEttnList: Array<string>;

        NewCompanyVendorNumber: string;
    };
}

export interface IDirectInvoiceOutput {
    DirectInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.IDirectInvoiceResult;
}

export interface ISearchInvoiceInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;

        CurrencyCode: string;
        DispatchNumberList: Array<string>;

        EnvelopeId: string;

        Ettn: string;
        ExcludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeDetailStatusList;
        ExcludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeStatusList;

        ExternalInvoiceCode: string;
        IncludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeDetailStatusList;
        IncludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeStatusList;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#InvoiceDirectionType(Incoming,Outgoing) */
        InvoiceDirection: "Incoming" | "Outgoing";
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#InvoiceType(SATIS,IADE,ISTISNA,TEVKIFAT,OZELMATRAH,IHRACKAYITLI,SGK,KOMISYONCU,TEVKIFATIADE) */
        InvoiceType: "SATIS" | "IADE" | "ISTISNA" | "TEVKIFAT" | "OZELMATRAH" | "IHRACKAYITLI" | "SGK" | "KOMISYONCU" | "TEVKIFATIADE";

        IsInvoicePaid: boolean;
        
        MaxApprovalDate: Date;
        
        MaxInvoiceCreationDate: Date;
        
        MaxInvoiceDate: Date;

        MaxInvoiceNumber: string;
        
        MaxLastPaymentDate: Date;
        
        MaxOrderDate: Date;
        
        MaxPaymentDate: Date;
        
        MaxTotalPayableAmount: number;
        
        MinApprovalDate: Date;
        
        MinInvoiceCreationDate: Date;
        
        MinInvoiceDate: Date;

        MinInvoiceNumber: string;
        
        MinLastPaymentDate: Date;
        
        MinOrderDate: Date;
        
        MinPaymentDate: Date;
        
        MinTotalPayableAmount: number;

        OrderNumber: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q20:Array<string>(undefined) */
        OrderNumberList: Array<string>;
        PagingRequest: InvoiceServiceBasicHttpEndpointTypes.IPagingRequest;

        ReceiverName: string;

        ReceiverTaxCode: string;
        ResultSet: {

            IsAdditionalTaxIncluded: boolean;

            IsArchiveIncluded: boolean;

            IsAttachmentIncluded: boolean;

            IsExternalUrlIncluded: boolean;

            IsHtmlIncluded: boolean;

            IsInvoiceDetailIncluded: boolean;

            IsPDFIncluded: boolean;

            IsXMLIncluded: boolean;
        };
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ScenarioType(None,TEMELFATURA,TICARIFATURA,IHRACAT,YOLCUBERABERFATURA,HKS,KAMU) */
        ScenarioType: "None" | "TEMELFATURA" | "TICARIFATURA" | "IHRACAT" | "YOLCUBERABERFATURA" | "HKS" | "KAMU";
    };
}

export interface ISearchInvoiceOutput {
    SearchInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ISearchInvoiceResult;
}

export interface ISearchAllInvoiceInput {
    request: {

        CompanyTaxCode: string;

        CurrencyCode: string;

        EnvelopeId: string;

        Ettn: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q21:Array<string>(undefined) */
        ExcludeCompanyVendorNumberList: Array<string>;
        ExcludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeDetailStatusList;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q22:Array<string>(undefined) */
        ExcludeReceiverTaxCodeList: Array<string>;
        ExcludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeStatusList;

        ExternalInvoiceCode: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q23:Array<string>(undefined) */
        IncludeCompanyVendorNumberList: Array<string>;
        IncludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeDetailStatusList;

        IncludeMainCompany: boolean;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q24:Array<string>(undefined) */
        IncludeReceiverTaxCodeList: Array<string>;
        IncludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeStatusList;
        InvoiceDirection: "Incoming" | "Outgoing";
        InvoiceType: "SATIS" | "IADE" | "ISTISNA" | "TEVKIFAT" | "OZELMATRAH" | "IHRACKAYITLI" | "SGK" | "KOMISYONCU" | "TEVKIFATIADE";
        IsInvoicePaid: boolean;
        MaxApprovalDate: Date;
        MaxDirectionDate: string;
        MaxInvoiceCreationDate: Date;
        MaxInvoiceDate: Date;
        MaxInvoiceNumber: string;
        MaxLastPaymentDate: Date;
        MaxOrderDate: Date;
        MaxPaymentDate: Date;
        MaxTotalPayableAmount: number;
        MinApprovalDate: Date;
        MinDirectionDate: string;
        MinInvoiceCreationDate: Date;
        MinInvoiceDate: Date;
        MinInvoiceNumber: string;
        MinLastPaymentDate: Date;
        MinOrderDate: Date;
        MinPaymentDate: Date;
        MinTotalPayableAmount: number;
        OrderNumber: string;
        PagingRequest: InvoiceServiceBasicHttpEndpointTypes.IPagingRequest;
        ReceiverName: string;
        ReceiverTaxCode: string;
        ResultSet: {
            IsAdditionalTaxIncluded: boolean;
            IsArchiveIncluded: boolean;
            IsAttachmentIncluded: boolean;
            IsExternalUrlIncluded: boolean;
            IsHtmlIncluded: boolean;
            IsInvoiceDetailIncluded: boolean;
            IsPDFIncluded: boolean;
            IsXMLIncluded: boolean;
        };
        ScenarioType: "None" | "TEMELFATURA" | "TICARIFATURA" | "IHRACAT" | "YOLCUBERABERFATURA" | "HKS" | "KAMU";
    };
}

export interface ISearchAllInvoiceOutput {
    SearchAllInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ISearchAllInvoiceResult;
}

export interface ISearchExternalInvoiceInput {
    request: {
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        InvoiceDirection: "Incoming" | "Outgoing";
        InvoiceNumber: string;
        MaxInvoiceDate: Date;
        MinInvoiceDate: Date;
    };
}

export interface ISearchExternalInvoiceOutput {
    SearchExternalInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ISearchExternalInvoiceResult;
}

export interface ISearchArchiveInvoiceInput {
    request: {
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        CurrencyCode: string;
        Ettn: string;
        ExcludeApprovalStatusList: Array<any>;
        ExcludeCancellationReportSendingStatusList: Array<any>;
        ExcludeReportSendingStatusList: Array<any>;
        ExcludeSendingStatusList: Array<any>;
        ExcludeStatusList: Array<any>;
        ExternalArchiveInvoiceCode: string;
        IncludeApprovalStatusList: Array<any>;
        IncludeCancellationReportSendingStatusList: Array<any>;
        IncludeReportSendingStatusList: Array<any>;
        IncludeSendingStatusList: Array<any>;
        IncludeStatusList: Array<any>;
        InvoiceType: "SATIS" | "IADE" | "ISTISNA" | "TEVKIFAT" | "OZELMATRAH" | "IHRACKAYITLI" | "SGK" | "KOMISYONCU" | "TEVKIFATIADE";
        IsCancelled: boolean;
        IsInvoicePaid: boolean;
        MaxApprovalDate: Date;
        MaxInvoiceCreationDate: Date;
        MaxInvoiceDate: Date;
        MaxInvoiceNumber: string;
        MaxLastPaymentDate: Date;
        MaxOrderDate: Date;
        MaxPaymentDate: Date;
        MaxTotalPayableAmount: number;
        MinApprovalDate: Date;
        MinInvoiceCreationDate: Date;
        MinInvoiceDate: Date;
        MinInvoiceNumber: string;
        MinLastPaymentDate: Date;
        MinOrderDate: Date;
        MinPaymentDate: Date;
        MinTotalPayableAmount: number;
        OrderNumber: string;
        PagingRequest: InvoiceServiceBasicHttpEndpointTypes.IPagingRequest;
        ReceiverName: string;
        ReceiverTaxCode: string;
        ResultSet: {
            IsAdditionalTaxIncluded: boolean;
            IsArchiveIncluded: boolean;
            IsAttachmentIncluded: boolean;
            IsExternalUrlIncluded: boolean;
            IsHtmlIncluded: boolean;
            IsInvoiceDetailIncluded: boolean;
            IsPDFIncluded: boolean;
            IsXMLIncluded: boolean;
        };
        SendingType: any;
    };
}

export interface ISearchArchiveInvoiceOutput {
    SearchArchiveInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ISearchArchiveInvoiceResult;
}

export interface IArchiveInvoiceInput {
    request: {
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        InvoiceDirection: "Incoming" | "Outgoing";
        InvoiceETTNList: Array<string>;
    };
}

export interface IArchiveInvoiceOutput {
    ArchiveInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceResult;
}

export interface IDeArchiveInvoiceInput {
    request: {
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        InvoiceDirection: "Incoming" | "Outgoing";
        InvoiceETTNList: Array<string>;
    };
}

export interface IDeArchiveInvoiceOutput {
    DeArchiveInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.IDeArchiveInvoiceResult;
}

export interface ICancelArchiveInvoiceInput {
    request: {
        ArchiveInvoiceList: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceList;
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
    };
}

export interface ICancelArchiveInvoiceOutput {
    CancelArchiveInvoiceResult: InvoiceServiceBasicHttpEndpointTypes.ICancelArchiveInvoiceResult;
}

export interface ISendArchiveInvoiceReportInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        
        LastDate: Date;
    };
}

export interface ISendArchiveInvoiceReportOutput {
    SendArchiveInvoiceReportResult: InvoiceServiceBasicHttpEndpointTypes.ISendArchiveInvoiceReportResult;
}

export interface ISearchArchiveInvoiceReportInput {
    request: {

        ArchiveInvoiceReportGroupNumber: string;

        ArchiveInvoiceReportNumber: string;

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
    };
}

export interface ISearchArchiveInvoiceReportOutput {
    SearchArchiveInvoiceReportResult: InvoiceServiceBasicHttpEndpointTypes.ISearchArchiveInvoiceReportResult;
}

export interface ISendArchiveInvoiceMailInput {
    request: {

        CompanyTaxCode: string;

        Email: string;

        Ettn: string;
    };
}

export interface ISendArchiveInvoiceMailOutput {
    SendArchiveInvoiceMailResult: InvoiceServiceBasicHttpEndpointTypes.ISendArchiveInvoiceMailResult;
}

export interface IGetEttnListInput {
    request: {

        CompanyTaxCode: string;

        CurrencyCode: string;

        EnvelopeId: string;

        Ettn: string;
        ExcludeCompanyVendorNumberList: Array<string>;
        ExcludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeDetailStatusList;
        ExcludeReceiverTaxCodeList: Array<string>;
        ExcludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeStatusList;
        ExternalInvoiceCode: string;
        IncludeCompanyVendorNumberList: Array<string>;
        IncludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeDetailStatusList;
        IncludeMainCompany: boolean;
        IncludeReceiverTaxCodeList: Array<string>;
        IncludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeStatusList;
        InvoiceDirection: "Incoming" | "Outgoing";
        InvoiceType: "SATIS" | "IADE" | "ISTISNA" | "TEVKIFAT" | "OZELMATRAH" | "IHRACKAYITLI" | "SGK" | "KOMISYONCU" | "TEVKIFATIADE";

        IsInvoicePaid: boolean;
        
        MaxApprovalDate: Date;

        MaxDirectionDate: string;
        
        MaxInvoiceCreationDate: Date;
        
        MaxInvoiceDate: Date;

        MaxInvoiceNumber: string;
        
        MaxLastPaymentDate: Date;
        
        MaxOrderDate: Date;
        MaxPaymentDate: Date;
        MaxTotalPayableAmount: number;
        
        MinApprovalDate: Date;

        MinDirectionDate: string;
        
        MinInvoiceCreationDate: Date;
        
        MinInvoiceDate: Date;

        MinInvoiceNumber: string;
        
        MinLastPaymentDate: Date;
        
        MinOrderDate: Date;
        
        MinPaymentDate: Date;
        MinTotalPayableAmount: number;

        OrderNumber: string;
        PagingRequest: InvoiceServiceBasicHttpEndpointTypes.IPagingRequest;

        ReceiverName: string;

        ReceiverTaxCode: string;
        ResultSet: {

            IsAdditionalTaxIncluded: boolean;

            IsArchiveIncluded: boolean;

            IsAttachmentIncluded: boolean;

            IsExternalUrlIncluded: boolean;

            IsHtmlIncluded: boolean;

            IsInvoiceDetailIncluded: boolean;

            IsPDFIncluded: boolean;

            IsXMLIncluded: boolean;
        };
        ScenarioType: "None" | "TEMELFATURA" | "TICARIFATURA" | "IHRACAT" | "YOLCUBERABERFATURA" | "HKS" | "KAMU";
    };
}

export interface IGetEttnListOutput {
    GetEttnListResult: InvoiceServiceBasicHttpEndpointTypes.IGetEttnListResult;
}

export interface IGetAbbreviationReportInput {
    request: {

        CompanyTaxCode: string;
        
        InvoiceDate: Date;
    };
}

export interface IGetAbbreviationReportOutput {
    GetAbbreviationReportResult: InvoiceServiceBasicHttpEndpointTypes.IGetAbbreviationReportResult;
}

export interface IGetAbbreviationDetailReportInput {
    request: {

        CompanyTaxCode: string;
        
        InvoiceDate: Date;
    };
}

export interface IGetAbbreviationDetailReportOutput {
    GetAbbreviationDetailReportResult: InvoiceServiceBasicHttpEndpointTypes.IGetAbbreviationDetailReportResult;
}

export interface ICreateReturnReceiptInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;

        Ettn: string;

        ExternalReturnReceiptNumber: string;

        ReceiverAddress: string;

        ReceiverName: string;

        ReceiverTaxCode: string;

        ReceiverTaxOffice: string;
        
        ReturnReceiptAmount: number;

        ReturnReceiptCurrencyCode: string;
        
        ReturnReceiptDate: Date;

        ReturnReceiptKdvBsmvNote: string;

        ReturnReceiptOperationPlace: string;

        ReturnReceiptReason: string;
        
        ReturnReceiptTaxRate: number;
        
        TotalReturnReceiptAmount: number;
    };
}

export interface ICreateReturnReceiptOutput {
    CreateReturnReceiptResult: InvoiceServiceBasicHttpEndpointTypes.ICreateReturnReceiptResult;
}

export interface ISendDespatchAdviceInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        DespatchAdvices: {
            DespatchAdvice: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdvice[];
        };
    };
}

export interface ISendDespatchAdviceOutput {
    SendDespatchAdviceResult: InvoiceServiceBasicHttpEndpointTypes.ISendDespatchAdviceResult;
}

export interface ISendDespatchAdviceXmlInput {
    request: {
        DespatchAdvices: {
            DespatchAdviceXml: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceXml[];
        };
    };
}

export interface ISendDespatchAdviceXmlOutput {
    SendDespatchAdviceXmlResult: InvoiceServiceBasicHttpEndpointTypes.ISendDespatchAdviceXmlResult;
}

export interface ISendDespatchAdviceXmlWithoutDespatchAdviceNumberInput {
    request: {

        CompanyVendorNumber: string;
        DespatchAdvices: {
            DespatchAdviceXml: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceXml[];
        };
    };
}

export interface ISendDespatchAdviceXmlWithoutDespatchAdviceNumberOutput {
    SendDespatchAdviceXmlWithoutDespatchAdviceNumberResult: InvoiceServiceBasicHttpEndpointTypes.ISendDespatchAdviceXmlWithoutDespatchAdviceNumberResult;
}

export interface ISearchDespatchAdviceInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;

        CurrencyCode: string;
        DespatchAdviceDirection: "Incoming" | "Outgoing";
        DespatchAdviceNumberList: Array<string>;
        DespatchAdviceType: "SEVK" | "MATBUDAN";

        EnvelopeId: string;

        Ettn: string;
        ExcludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeDetailStatusList;
        ExcludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeStatusList;

        ExternalDespatchAdviceCode: string;
        IncludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeDetailStatusList;
        IncludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeStatusList;
        
        MaxDespatchAdviceCreationDate: Date;
        
        MaxDespatchAdviceDate: Date;

        MaxDespatchAdviceNumber: string;
        
        MaxOrderDate: Date;
        
        MinDespatchAdviceCreationDate: Date;
        
        MinDespatchAdviceDate: Date;

        MinDespatchAdviceNumber: string;
        
        MinOrderDate: Date;

        OrderNumber: string;
        PagingRequest: InvoiceServiceBasicHttpEndpointTypes.IPagingRequest;

        ReceiverName: string;

        ReceiverTaxCode: string;
        ResultSet: {

            IsArchiveIncluded: boolean;

            IsAttachmentIncluded: boolean;

            IsDespatchAdviceDetailIncluded: boolean;

            IsHtmlIncluded: boolean;

            IsPDFIncluded: boolean;

            IsXMLIncluded: boolean;
        };
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#DespatchAdviceScenarioType(TEMELIRSALIYE) */
        ScenarioType: "TEMELIRSALIYE";
    };
}

export interface ISearchDespatchAdviceOutput {
    SearchDespatchAdviceResult: InvoiceServiceBasicHttpEndpointTypes.ISearchDespatchAdviceResult;
}

export interface ISendReceiptAdviceInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;
        ReceiptAdvices: {
            ReceiptAdvice: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdvice[];
        };
    };
}

export interface ISendReceiptAdviceOutput {
    SendReceiptAdviceResult: InvoiceServiceBasicHttpEndpointTypes.ISendReceiptAdviceResult;
}

export interface ISendReceiptAdviceXmlInput {
    request: {
        ReceiptAdvices: {
            ReceiptAdviceXml: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceXml[];
        };
    };
}

export interface ISendReceiptAdviceXmlOutput {
    SendReceiptAdviceXmlResult: InvoiceServiceBasicHttpEndpointTypes.ISendReceiptAdviceXmlResult;
}

export interface ISendReceiptAdviceXmlWithoutReceiptAdviceNumberInput {
    request: {

        CompanyVendorNumber: string;
        ReceiptAdvices: {
            ReceiptAdviceXml: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceXml[];
        };
    };
}

export interface ISendReceiptAdviceXmlWithoutReceiptAdviceNumberOutput {
    SendReceiptAdviceXmlWithoutReceiptAdviceNumberResult: InvoiceServiceBasicHttpEndpointTypes.ISendReceiptAdviceXmlWithoutReceiptAdviceNumberResult;
}

export interface ISearchReceiptAdviceInput {
    request: {

        CompanyTaxCode: string;

        CompanyVendorNumber: string;

        CurrencyCode: string;

        EnvelopeId: string;

        Ettn: string;
        ExcludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeDetailStatusList;
        ExcludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IExcludeStatusList;

        ExternalReceiptAdviceCode: string;
        IncludeDetailStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeDetailStatusList;
        IncludeStatusList: InvoiceServiceBasicHttpEndpointTypes.IIncludeStatusList;
        
        MaxOrderDate: Date;
        
        MaxReceiptAdviceCreationDate: Date;
        
        MaxReceiptAdviceDate: Date;

        MaxReceiptAdviceNumber: string;
        
        MinOrderDate: Date;
        
        MinReceiptAdviceCreationDate: Date;
        
        MinReceiptAdviceDate: Date;

        MinReceiptAdviceNumber: string;

        OrderNumber: string;
        PagingRequest: InvoiceServiceBasicHttpEndpointTypes.IPagingRequest;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#InvoiceDirectionType(Incoming,Outgoing) */
        ReceiptAdviceDirection: "Incoming" | "Outgoing";
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ReceiptAdviceType(SEVK) */
        ReceiptAdviceType: "SEVK";

        ReceiverName: string;

        ReceiverTaxCode: string;
        ResultSet: {

            IsArchiveIncluded: boolean;

            IsAttachmentIncluded: boolean;

            IsHtmlIncluded: boolean;

            IsPDFIncluded: boolean;

            IsReceiptAdviceDetailIncluded: boolean;

            IsXMLIncluded: boolean;
        };
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#DespatchAdviceScenarioType(TEMELIRSALIYE) */
        ScenarioType: "TEMELIRSALIYE";
    };
}

export interface ISearchReceiptAdviceOutput {
    SearchReceiptAdviceResult: InvoiceServiceBasicHttpEndpointTypes.ISearchReceiptAdviceResult;
}

export interface ISendESMMInput {
    request: {
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        ESMM: any;
    };
}

export interface ISendESMMOutput {
    SendESMMResult: InvoiceServiceBasicHttpEndpointTypes.ISendESMMResult;
}

export interface ISendESMMXmlInput {
    request: {
        ESMM: string;
    };
}

export interface ISendESMMXmlOutput {
    SendESMMXmlResult: InvoiceServiceBasicHttpEndpointTypes.ISendESMMXmlResult;
}

export interface ISearchESMMInput {
    request: {
        Archived: boolean;
        CompanyId: number;
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        DocumentNumber: string;
        Ettn: string;
        ExcludeApprovalStatusList: Array<any>;
        ExcludeCancellationReportSendingStatusList: Array<any>;
        ExcludeReportSendingStatusList: Array<any>;
        ExcludeSendingStatusList: Array<any>;
        ExcludeStatusList: Array<any>;
        ExternalDocumentNumber: string;
        IdMainCompany: number;
        IncludeApprovalStatusList: Array<any>;
        IncludeCancellationReportSendingStatusList: Array<any>;
        IncludeReportSendingStatusList: Array<any>;
        IncludeSendingStatusList: Array<any>;
        IncludeStatusList: Array<any>;
        IsCanceled: boolean;
        IsDeleted: boolean;
        MaxCost: number;
        MaxDocumentCreationDate: Date;
        MaxDocumentDate: Date;
        MinCost: number;
        MinDocumentCreationDate: Date;
        MinDocumentDate: Date;
        PagingRequest: InvoiceServiceBasicHttpEndpointTypes.IPagingRequest;
        ReceiverName: string;
        ResultSet: any;
        SchemaName: string;
        VNKTCKN: string;
    };
}

export interface ISearchESMMOutput {
    SearchESMMResult: InvoiceServiceBasicHttpEndpointTypes.ISearchESMMResult;
}

export interface ICancelESMMInput {
    request: {
        CompanyTaxCode: string;
        CompanyVendorNumber: string;
        ESMM: InvoiceServiceBasicHttpEndpointTypes.IESMM;
    };
}

export interface ICancelESMMOutput {
    CancelESMMResult: InvoiceServiceBasicHttpEndpointTypes.ICancelESMMResult;
}

export interface IGetCompanyBalanceInput {
    request: {
        CompanyTaxCode: string;
    };
}

export interface IGetCompanyBalanceOutput {
    GetCompanyBalanceResult: InvoiceServiceBasicHttpEndpointTypes.IGetCompanyBalanceResult;
}

export interface IInvoiceServiceBasicHttpEndpointSoap {
    SendInvoice: (input: ISendInvoiceInput, cb: (err: any | null, result: ISendInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendInvoiceApi: (input: ISendInvoiceApiInput, cb: (err: any | null, result: ISendInvoiceApiOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendInvoiceXml: (input: ISendInvoiceXmlInput, cb: (err: any | null, result: ISendInvoiceXmlOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendInvoiceXmlWithoutInvoiceNumber: (input: ISendInvoiceXmlWithoutInvoiceNumberInput, cb: (err: any | null, result: ISendInvoiceXmlWithoutInvoiceNumberOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendCurrencyInvoice: (input: ISendCurrencyInvoiceInput, cb: (err: any | null, result: ISendCurrencyInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendCurrencyInvoiceApi: (input: ISendCurrencyInvoiceApiInput, cb: (err: any | null, result: ISendCurrencyInvoiceApiOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendArchiveInvoice: (input: ISendArchiveInvoiceInput, cb: (err: any | null, result: ISendArchiveInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendArchiveInvoiceApi: (input: ISendArchiveInvoiceApiInput, cb: (err: any | null, result: ISendArchiveInvoiceApiOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendArchiveInvoiceXml: (input: ISendArchiveInvoiceXmlInput, cb: (err: any | null, result: ISendArchiveInvoiceXmlOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendArchiveInvoiceXmlWithoutInvoiceNumber: (input: ISendArchiveInvoiceXmlWithoutInvoiceNumberInput, cb: (err: any | null, result: ISendArchiveInvoiceXmlWithoutInvoiceNumberOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendInvoiceReply: (input: ISendInvoiceReplyInput, cb: (err: any | null, result: ISendInvoiceReplyOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    UpdateInvoiceState: (input: IUpdateInvoiceStateInput, cb: (err: any | null, result: IUpdateInvoiceStateOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    DirectInvoice: (input: IDirectInvoiceInput, cb: (err: any | null, result: IDirectInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchInvoice: (input: ISearchInvoiceInput, cb: (err: any | null, result: ISearchInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchAllInvoice: (input: ISearchAllInvoiceInput, cb: (err: any | null, result: ISearchAllInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchExternalInvoice: (input: ISearchExternalInvoiceInput, cb: (err: any | null, result: ISearchExternalInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchArchiveInvoice: (input: ISearchArchiveInvoiceInput, cb: (err: any | null, result: ISearchArchiveInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    ArchiveInvoice: (input: IArchiveInvoiceInput, cb: (err: any | null, result: IArchiveInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    DeArchiveInvoice: (input: IDeArchiveInvoiceInput, cb: (err: any | null, result: IDeArchiveInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    CancelArchiveInvoice: (input: ICancelArchiveInvoiceInput, cb: (err: any | null, result: ICancelArchiveInvoiceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendArchiveInvoiceReport: (input: ISendArchiveInvoiceReportInput, cb: (err: any | null, result: ISendArchiveInvoiceReportOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchArchiveInvoiceReport: (input: ISearchArchiveInvoiceReportInput, cb: (err: any | null, result: ISearchArchiveInvoiceReportOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendArchiveInvoiceMail: (input: ISendArchiveInvoiceMailInput, cb: (err: any | null, result: ISendArchiveInvoiceMailOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    GetEttnList: (input: IGetEttnListInput, cb: (err: any | null, result: IGetEttnListOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    GetAbbreviationReport: (input: IGetAbbreviationReportInput, cb: (err: any | null, result: IGetAbbreviationReportOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    GetAbbreviationDetailReport: (input: IGetAbbreviationDetailReportInput, cb: (err: any | null, result: IGetAbbreviationDetailReportOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    CreateReturnReceipt: (input: ICreateReturnReceiptInput, cb: (err: any | null, result: ICreateReturnReceiptOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendDespatchAdvice: (input: ISendDespatchAdviceInput, cb: (err: any | null, result: ISendDespatchAdviceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendDespatchAdviceXml: (input: ISendDespatchAdviceXmlInput, cb: (err: any | null, result: ISendDespatchAdviceXmlOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendDespatchAdviceXmlWithoutDespatchAdviceNumber: (input: ISendDespatchAdviceXmlWithoutDespatchAdviceNumberInput, cb: (err: any | null, result: ISendDespatchAdviceXmlWithoutDespatchAdviceNumberOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchDespatchAdvice: (input: ISearchDespatchAdviceInput, cb: (err: any | null, result: ISearchDespatchAdviceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendReceiptAdvice: (input: ISendReceiptAdviceInput, cb: (err: any | null, result: ISendReceiptAdviceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendReceiptAdviceXml: (input: ISendReceiptAdviceXmlInput, cb: (err: any | null, result: ISendReceiptAdviceXmlOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendReceiptAdviceXmlWithoutReceiptAdviceNumber: (input: ISendReceiptAdviceXmlWithoutReceiptAdviceNumberInput, cb: (err: any | null, result: ISendReceiptAdviceXmlWithoutReceiptAdviceNumberOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchReceiptAdvice: (input: ISearchReceiptAdviceInput, cb: (err: any | null, result: ISearchReceiptAdviceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendESMM: (input: ISendESMMInput, cb: (err: any | null, result: ISendESMMOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SendESMMXml: (input: ISendESMMXmlInput, cb: (err: any | null, result: ISendESMMXmlOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    SearchESMM: (input: ISearchESMMInput, cb: (err: any | null, result: ISearchESMMOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    CancelESMM: (input: ICancelESMMInput, cb: (err: any | null, result: ICancelESMMOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
    GetCompanyBalance: (input: IGetCompanyBalanceInput, cb: (err: any | null, result: IGetCompanyBalanceOutput, raw: string, soapHeader: { [k: string]: any; }) => any, options?: any, extraHeaders?: any) => void;
}

export namespace InvoiceServiceBasicHttpEndpointTypes {
    export interface IDocumentReference {
        CountryOfOrigin: string;
        CustomsDeclarationDate: Date;
        CustomsDeclarationNumber: number;
        CustomsOfficeConfirmationLetterDate: Date;
        CustomsOfficeConfirmationLetterNumber: number;
        CustomsOfficeInvoiceNumber: string;
        DocumentDescription: string;
        DocumentReferenceId: string;
        DocumentType: string;
        DocumentTypeCode: string;
        ForeignCurrencyStatementDate: Date;
        ForeignCurrencyStatementNumber: number;
        Id: string;
        IssueDate: Date;
        ReasonForComing: number;
        StatisticsNumber: string;
    }
    export interface IAdditionalDocumentReferences {
        DocumentReference: InvoiceServiceBasicHttpEndpointTypes.IDocumentReference[];
    }
    export interface ICompanyBranchAddress {

        BoulevardAveneuStreetName: string;

        BuildingName: string;

        BuildingNumber: string;
        
        CityCode: number;

        CityName: string;

        EMail: string;

        FaxNumber: string;
        
        PostalCode: number;
        
        TaxOfficeCode: number;

        TaxOfficeName: string;

        TelephoneNumber: string;
        
        TownCode: number;

        TownName: string;

        WebSite: string;
    }
    export interface IDeliveryAddress {

        BuildingNumber: string;

        CityName: string;

        CitySubdivisionName: string;

        CountryName: string;

        PostalCode: string;

        Region: string;

        StreetName: string;
    }
    export interface IPostalAddress {

        BuildingNumber: string;

        CityName: string;

        CitySubdivisionName: string;

        CountryName: string;

        PostalCode: string;

        Region: string;

        StreetName: string;
    }
    export interface IDeliveryParty {

        PartyName: string;

        PartyTaxCode: string;
        PostalAddress: InvoiceServiceBasicHttpEndpointTypes.IPostalAddress;
    }
    export interface IDeliveryTerms {

        SpecialTerms: string;
    }
    export interface IDespatchParty {

        PartyName: string;

        PartyTaxCode: string;
        PostalAddress: InvoiceServiceBasicHttpEndpointTypes.IPostalAddress;
    }
    export interface IDespatch {
        DespatchParty: InvoiceServiceBasicHttpEndpointTypes.IDespatchParty;
    }
    export interface IShipmentPackage {

        PackageId: string;
        
        PackageQuantity: number;

        PackagingTypeCode: string;
    }
    export interface IShipmentPackageList {
        ShipmentPackage: InvoiceServiceBasicHttpEndpointTypes.IShipmentPackage[];
    }
    export interface IShipmentStage {

        TransportModeCode: string;
    }
    export interface IShipmentTransportMeans {

        AirCraftId: string;

        LicensePlateId: string;

        TrainId: string;

        VesselId: string;
    }
    export interface IShipmentTransportMeansList {
        ShipmentTransportMeans: InvoiceServiceBasicHttpEndpointTypes.IShipmentTransportMeans[];
    }
    export interface IDispatch {
        
        DispatchDate: Date;

        DispatchNumber: string;
    }
    export interface IDispatchList {
        Dispatch: InvoiceServiceBasicHttpEndpointTypes.IDispatch[];
    }
    export interface IExportReceiver {

        BoulevardAveneuStreetName: string;

        BuildingNumber: string;

        CityName: string;

        CountryName: string;

        ExternalReceiverCode: string;

        OfficialReceiverName: string;

        PostalCode: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        ReceiverType: any;

        TownName: string;
    }
    export interface IInvoiceAdditionalIdentityInfo {

        BranchNo: string;

        CommercialRegisterNo: string;

        CounterNo: string;

        CustomerNo: string;

        DistributorNo: string;

        EpdkNo: string;

        FarmerNo: string;

        FileNo: string;

        IntermediaryCorporationTag: string;

        IntermediaryCorporationVkn: string;

        ManufacturerNo: string;

        MersisNo: string;

        PasaportNo: string;

        PatientNo: string;

        PhoneNo: string;

        PlumbingNo: string;

        ProducerNo: string;

        SellerNo: string;

        ServiceNo: string;

        SubscriberNo: string;

        TapdkNo: string;

        Tckn: string;

        Vkn: string;
    }
    export interface IInvoiceAttachment {
        FileContent: Buffer;

        FileName: string;
    }
    export interface IInvoiceAttachments {
        InvoiceAttachment: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAttachment[];
    }
    export interface ITax {
        
        TaxAmount: number;

        TaxCode: string;
        
        TaxRate: number;
    }
    export interface IAdditionalTaxes {
        Tax: InvoiceServiceBasicHttpEndpointTypes.ITax[];
    }
    export interface IDeliveryList {
        Delivery: Array<{
            
            ActualDeliveryDate: Date;
            DeliveryAddress: InvoiceServiceBasicHttpEndpointTypes.IDeliveryAddress;
            DeliveryParty: InvoiceServiceBasicHttpEndpointTypes.IDeliveryParty;

            DeliveryTermCode: string;
            DeliveryTerms: InvoiceServiceBasicHttpEndpointTypes.IDeliveryTerms;
            Despatch: InvoiceServiceBasicHttpEndpointTypes.IDespatch;
            
            LatestDeliveryDate: Date;

            ProductTraceId: string;
            Shipment: {

                GrossVolumeMeasure: string;

                GrossVolumeMeasureUnitCode: string;

                GrossWeightMeasure: string;

                GrossWeightMeasureUnitCode: string;
                /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q3:Array<string>(undefined) */
                GtipNoList: Array<string>;
                ShipmentPackageList: InvoiceServiceBasicHttpEndpointTypes.IShipmentPackageList;
                ShipmentStageList: {
                    ShipmentStage: InvoiceServiceBasicHttpEndpointTypes.IShipmentStage[];
                };
                ShipmentTransportMeansList: InvoiceServiceBasicHttpEndpointTypes.IShipmentTransportMeansList;
            };

            TrackingId: string;
        }>;
    }
    export interface IProduct {

        DmoBarcode: string;

        DmoProductCode: string;

        ExternalProductCode: string;

        MeasureUnit: string;

        ProductCode: string;

        ProductName: string;

        ReceiverProductCode: string;
        
        UnitPrice: number;
    }
    export interface IWitholdingTaxes {
        Tax: InvoiceServiceBasicHttpEndpointTypes.ITax[];
    }
    export interface IInvoiceDetail {
        AdditionalTaxes: InvoiceServiceBasicHttpEndpointTypes.IAdditionalTaxes;

        CurrencyCode: string;
        
        CustomsTrackingNumberList: Array<string>;
        DeliveryList: InvoiceServiceBasicHttpEndpointTypes.IDeliveryList;
        
        DiscountAmount: number;
        
        DiscountRate: number;
        
        IdMensei: number;
        
        IdSiniflandirmaKodu: number;
        
        LineExtensionAmount: number;

        LineId: string;

        Mensei: string;

        Note: string;

        OwnerIdentificationNumber: string;

        OwnerName: string;

        PackageBrand: string;
        Product: InvoiceServiceBasicHttpEndpointTypes.IProduct;
        
        Quantity: number;

        SalesOrderLineId: string;

        SiniflandirmaKodu: string;
        
        SpecialBasisAmount: number;
        
        SpecialBasisPercent: number;

        SpecialBasisReasonCode: string;
        
        SpecialBasisTaxAmount: number;

        StockDescription: string;

        TagNumber: string;

        TaxExemptionReason: string;

        TaxExemptionReasonCode: string;

        UUID: string;
        
        VATAmount: number;
        
        VATRate: number;
        WitholdingTaxes: InvoiceServiceBasicHttpEndpointTypes.IWitholdingTaxes;
    }
    export interface IInvoiceExpense {
        
        DeductionPrice: number;
        
        DeductionRatio: number;
        
        TaxPrice: number;
        
        TaxRatio: number;
        Type: "Komisyon" | "Navlun" | "Hammaliye" | "Gelir_Vergisi_Tevkifati" | "Bagkur_Tevkifati" | "Hal_Rusumu" | "Tic_Borsası" | "Milli_Savunma_Fonu" | "Diger_Masraflar" | "Nakliye";
    }
    export interface IInvoiceExpenses {
        InvoiceExpense: InvoiceServiceBasicHttpEndpointTypes.IInvoiceExpense[];
    }
    export interface IInvoiceSenderAdditionalIdentityInfo {

        BranchNo: string;

        CommercialRegisterNo: string;

        CounterNo: string;

        CustomerNo: string;

        DistributorNo: string;

        EpdkNo: string;

        FarmerNo: string;

        FileNo: string;

        IntermediaryCorporationTag: string;

        IntermediaryCorporationVkn: string;

        ManufacturerNo: string;

        MersisNo: string;

        PasaportNo: string;

        PatientNo: string;

        PhoneNo: string;

        PlumbingNo: string;

        ProducerNo: string;

        SellerNo: string;

        ServiceNo: string;

        SubscriberNo: string;

        TapdkNo: string;

        Tckn: string;

        Vkn: string;
    }
    export interface IInvoiceTotalTaxList {
        Tax: InvoiceServiceBasicHttpEndpointTypes.ITax[];
    }
    export interface IPaymentAccount {
        
        BranchCode: number;

        Iban: string;

        Number: string;
    }
    export interface IPayment {

        InvoiceETTN: string;
        PaymentAccount: InvoiceServiceBasicHttpEndpointTypes.IPaymentAccount;
        PaymentChannel: "NONE" | "CommercialBanking";

        PaymentChannelCode: string;
        
        PaymentDate: Date;
    }
    export interface IPublicReceiver {
        
        PublicReceiverCity: number;

        PublicReceiverCountry: string;

        PublicReceiverTitle: string;

        PublicReceiverVkn: string;
    }
    export interface IAddress {

        BoulevardAveneuStreetName: string;

        BuildingName: string;

        BuildingNumber: string;
        
        CityCode: number;

        CityName: string;

        EMail: string;

        FaxNumber: string;
        
        PostalCode: number;
        
        TaxOfficeCode: number;

        TaxOfficeName: string;

        TelephoneNumber: string;
        
        TownCode: number;

        TownName: string;

        WebSite: string;
    }
    export interface IReceiver {
        Address: InvoiceServiceBasicHttpEndpointTypes.IAddress;

        ExternalReceiverCode: string;

        InstallationNumber: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        RecipientType: any
        SendingType: any

        VendorNumber: string;
    }
    export interface IReceiverBranchAddress {

        BoulevardAveneuStreetName: string;

        BuildingName: string;

        BuildingNumber: string;
        
        CityCode: number;

        CityName: string;

        EMail: string;

        FaxNumber: string;
        
        PostalCode: number;
        
        TaxOfficeCode: number;

        TaxOfficeName: string;

        TelephoneNumber: string;
        
        TownCode: number;

        TownName: string;

        WebSite: string;
    }
    export interface IRepresentativeParty {

        InboxTag: string;

        Name: string;

        TaxCode: string;
    }
    export interface ITourist {

        BankAccountNumber: string;

        BankBranchNumber: string;

        BankName: string;

        City: string;

        Country: string;

        Name: string;

        NationalityCode: string;
        
        PassportDate: Date;

        PassportNumber: string;

        SurName: string;
    }
    export interface IInvoice {

        AccountingCost: string;
        
        ActualExportDate: Date;
        AdditionalDocumentReferences: InvoiceServiceBasicHttpEndpointTypes.IAdditionalDocumentReferences;

        AliciBayiNo: string;

        ApplicationResponseDescription: string;
        ApplicationResponseStatus: "Onay_Bekliyor" | "Onaylandi" | "Reddedildi" | "Onay_Akisinda" | "Iade_Edildi" | "Gonderildi" | "Ziplendi" | "Gibe_Iletildi" | "Imza_Bekliyor" | "Gib_Tarafinda_Hata_Olustu" | "Sistem_Hatasi" | "Alici_Kabul_Etti" | "Alici_Reddetti" | "Alici_Iade_Etti" | "Otomatik_Onaylandi" | "Otomatik_Alici_Kabul_Etti" | "Uygulama_Yaniti_Yollaniyor" | "Uygulama_Yaniti_Hata_Aldi" | "Irsaliye_Yaniti_Yollaniyor" | "Irsaliye_Yaniti_Hata_Aldi";
        
        ApprovalDate: Date;
        
        ArchiveDate: Date;
        BankAccountList: Array<number>;
        CompanyBranchAddress: InvoiceServiceBasicHttpEndpointTypes.ICompanyBranchAddress;

        CompanyVendorNumber: string;
        
        CrossRate: number;
        
        CrossRateDate: Date;

        CurrencyCode: string;
        Delivery: {
            
            ActualDeliveryDate: Date;
            DeliveryAddress: InvoiceServiceBasicHttpEndpointTypes.IDeliveryAddress;
            DeliveryParty: InvoiceServiceBasicHttpEndpointTypes.IDeliveryParty;

            DeliveryTermCode: string;
            DeliveryTerms: InvoiceServiceBasicHttpEndpointTypes.IDeliveryTerms;
            Despatch: InvoiceServiceBasicHttpEndpointTypes.IDespatch;
            
            LatestDeliveryDate: Date;

            ProductTraceId: string;
            Shipment: {

                GrossVolumeMeasure: string;

                GrossVolumeMeasureUnitCode: string;

                GrossWeightMeasure: string;

                GrossWeightMeasureUnitCode: string;
                GtipNoList: Array<string>;
                ShipmentPackageList: InvoiceServiceBasicHttpEndpointTypes.IShipmentPackageList;
                ShipmentStageList: {
                    ShipmentStage: InvoiceServiceBasicHttpEndpointTypes.IShipmentStage[];
                };
                ShipmentTransportMeansList: InvoiceServiceBasicHttpEndpointTypes.IShipmentTransportMeansList;
            };

            TrackingId: string;
        };
        DetailStatus: "Zarflanmadi" | "Zarf_Kuyruga_Eklendi" | "Zarf_Isleniyor" | "Zip_Dosyasi_Degil" | "ZarfId_Uzunlugu_Gecersiz" | "Zarf_Arsivden_Kopyalanamadi" | "Zip_Acilamadi" | "Zip_Bir_Dosya_Icermeli" | "XML_Dosyasi_Degil" | "Zarf_ID_Ve_XML_Dosyasinin_Adi_Ayni_Olmali" | "Dokuman_Ayristirilamadi" | "Zarf_ID_Yok" | "Zarf_ID_VE_Zip_Dosyasi_Adi_Ayni_Olmali" | "Gecersiz_Versiyon" | "Schematron_Kontrol_Sonucu_Hatali" | "Xml_Sema_Kontrolundan_Gecemedi" | "Imza_Sahibi_TCKN_VKN_Alinamadi" | "Imza_Kaydedilemedi" | "Gonderilen_Zarf_Kayitli_bir_Fatura_Icermelidir" | "Gonderilen_Zarf_Kayitli_bir_Belge_Icermektedir" | "Yetki_Kontrol_Edilemedi" | "Gonderici_Birim_Yetkisi_Yok" | "Posta_Kutusu_Yetkisi_Yok" | "Islem_Yetkisi_Yok" | "Imza_Yetkisi_Kontrol_Edilemedi" | "Imza_Sahibi_Yetkisi" | "Gecersiz_Imza" | "Adres_Kontrol_Edilemedi" | "Adres_Bulunamadi" | "Kullanici_Eklenemedi" | "Kullanici_Silinemedi" | "Sistem_Yaniti_Hazirlanamadi" | "Sistem_Hatasi" | "Zarf_Basariyla_Islendi" | "Dokuman_Bulunan_Adrese_Gonderilemedi" | "Dokuman_Gonderimi_Basarisiz_Tekrar_Gonderme_Sonlandi" | "Hedeften_Sistem_Yaniti_Gelmedi" | "Hedeften_Sistem_Yaniti_Basarisiz_Geldi" | "Fatura_Iptale_Konu_Edildi" | "Basariyla_Tamamlandi";
        
        DirectionDate: Date;
        DispatchList: InvoiceServiceBasicHttpEndpointTypes.IDispatchList;

        ETTN: string;

        EnvelopeId: string;
        ExportReceiver: InvoiceServiceBasicHttpEndpointTypes.IExportReceiver;

        ExportRegisteredReasonCode: string;

        ExternalInvoiceCode: string;
        FinancialAccount: {
            FinancialAccount: Array<{

                Currency: string;

                Iban: string;

                PaymentNote: string;
            }>;
        };

        GcbRegistrationNumber: string;

        GtbReferenceNumber: string;
        IdRepresentative: number;
        InvoiceAdditionalIdentityInfo: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAdditionalIdentityInfo;
        InvoiceAttachments: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAttachments;
        InvoiceCreationDate: Date;
        InvoiceDate: Date;
        InvoiceDetails: {
            InvoiceDetail: InvoiceServiceBasicHttpEndpointTypes.IInvoiceDetail[];
        };
        InvoiceExpenses: InvoiceServiceBasicHttpEndpointTypes.IInvoiceExpenses;
        InvoiceExternalUrl: string;
        InvoiceHtml: Buffer;
        InvoiceNumber: string;
        InvoicePdf: Buffer;
        InvoicePeriodEndDate: Date;
        InvoicePeriodStartDate: Date;
        InvoiceSenderAdditionalIdentityInfo: InvoiceServiceBasicHttpEndpointTypes.IInvoiceSenderAdditionalIdentityInfo;
        InvoiceTotalTaxList: InvoiceServiceBasicHttpEndpointTypes.IInvoiceTotalTaxList;
        InvoiceType: "SATIS" | "IADE" | "ISTISNA" | "TEVKIFAT" | "OZELMATRAH" | "IHRACKAYITLI" | "SGK" | "KOMISYONCU" | "TEVKIFATIADE";
        InvoiceXml: Buffer;
        IsArchived: boolean;
        IsFreeOfCharge: boolean;
        KismiIadeMi: boolean;
        LastPaymentDate: Date;
        Notes: Array<string>;
        OrderDate: Date;
        OrderNumber: string;
        Payment: InvoiceServiceBasicHttpEndpointTypes.IPayment;
        PublicReceiver: InvoiceServiceBasicHttpEndpointTypes.IPublicReceiver;
        Receiver: InvoiceServiceBasicHttpEndpointTypes.IReceiver;
        ReceiverBranchAddress: InvoiceServiceBasicHttpEndpointTypes.IReceiverBranchAddress;
        ReceiverInboxTag: string;
        ReceiverResponseDescription: string;
        RejectReason: string;
        RepresentativeParty: InvoiceServiceBasicHttpEndpointTypes.IRepresentativeParty;
        ReturnInvoiceDate: Date;
        ReturnInvoiceETTN: string;
        ReturnInvoiceNumber: string;
        ReturnNote: string;
        ScacCode: string;
        ScenarioType: "None" | "TEMELFATURA" | "TICARIFATURA" | "IHRACAT" | "YOLCUBERABERFATURA" | "HKS" | "KAMU";
        Status: "Onay_Bekliyor" | "Onaylandi" | "Reddedildi" | "Onay_Akisinda" | "Iade_Edildi" | "Gonderildi" | "Ziplendi" | "Gibe_Iletildi" | "Imza_Bekliyor" | "Gib_Tarafinda_Hata_Olustu" | "Sistem_Hatasi" | "Alici_Kabul_Etti" | "Alici_Reddetti" | "Alici_Iade_Etti" | "Otomatik_Onaylandi" | "Otomatik_Alici_Kabul_Etti" | "Uygulama_Yaniti_Yollaniyor" | "Uygulama_Yaniti_Hata_Aldi" | "Irsaliye_Yaniti_Yollaniyor" | "Irsaliye_Yaniti_Hata_Aldi";

        SystemResponseDescription: string;

        TaxExemptionReason: string;
        
        TotalDiscountAmount: number;
        
        TotalLineExtensionAmount: number;
        
        TotalPayableAmount: number;
        
        TotalTaxInclusiveAmount: number;
        
        TotalVATAmount: number;
        Tourist: InvoiceServiceBasicHttpEndpointTypes.ITourist;
        
        XsltTemplate: Buffer;
    }
    export interface IInvoiceReturn {

        Ettn: string;

        ExternalInvoiceCode: string;

        InvoiceNumber: string;
    }
    export interface ISendInvoiceResult {

        ErrorMessage: string;
        Result: "Success" | "Failed";
        Invoices: {
            InvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReturn[];
        };
    }
    export interface ISendInvoiceApiResult {

        ErrorMessage: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ResultType(Success,Failed) */
        Result: "Success" | "Failed";
        Invoices: {
            InvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReturn[];
        };
    }
    export interface IInvoiceXml {
        
        InvoiceContent: Buffer;

        ReceiverTag: string;
    }
    export interface ISendInvoiceXmlResult {

        ErrorMessage: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ResultType(Success,Failed) */
        Result: "Success" | "Failed";
        Invoices: {
            InvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReturn[];
        };
    }
    export interface ISendInvoiceXmlWithoutInvoiceNumberResult {

        ErrorMessage: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ResultType(Success,Failed) */
        Result: "Success" | "Failed";
        Invoices: {
            InvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReturn[];
        };
    }
    export interface ICurrencyInvoiceDetail {
        AdditionalTaxes: InvoiceServiceBasicHttpEndpointTypes.IAdditionalTaxes;
        
        CalculationRate: number;
        
        CrossDate: Date;

        CurrencyCode: string;
        
        PayableAmount: number;
        
        UsdCalculationRate: number;
    }
    export interface ICurrencyInvoiceDetails {
        CurrencyInvoiceDetail: InvoiceServiceBasicHttpEndpointTypes.ICurrencyInvoiceDetail[];
    }
    export interface ICurrencyInvoice {
        AdditionalDocumentReferences: InvoiceServiceBasicHttpEndpointTypes.IAdditionalDocumentReferences;

        AliciBayiNo: string;

        AuthorizedInstitutionFileNumber: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q8:Array<number>(undefined) */
        BankAccountList: Array<number>;
        CompanyBranchAddress: InvoiceServiceBasicHttpEndpointTypes.ICompanyBranchAddress;

        CopyIndicator: boolean;
        
        CrossRateDate: Date;
        CurrencyInvoiceDetails: InvoiceServiceBasicHttpEndpointTypes.ICurrencyInvoiceDetails;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#CurrencyInvoiceType(DOVIZALIMBELGESI,DOVIZSATIMBELGESI) */
        CurrencyInvoiceType: "DOVIZALIMBELGESI" | "DOVIZSATIMBELGESI";

        EnvelopeId: string;

        Ettn: string;

        ExternalInvoiceCode: string;
        FinancialAccount: {
            FinancialAccount: Array<{

                Currency: string;

                Iban: string;

                PaymentNote: string;
            }>;
        };
        InvoiceAttachments: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAttachments;
        
        InvoiceIssueDate: Date;
        
        InvoiceIssueTime: Date;

        InvoiceNumber: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q9:Array<string>(undefined) */
        Notes: Array<string>;
        Receiver: InvoiceServiceBasicHttpEndpointTypes.IReceiver;
        ReceiverBranchAddress: InvoiceServiceBasicHttpEndpointTypes.IReceiverBranchAddress;

        ReceiverInboxTag: string;
        
        RecipientTypeId: number;
        
        ReturnInvoiceDate: Date;

        ReturnInvoiceETTN: string;

        ReturnInvoiceNumber: string;

        ReturnNote: string;
        
        TotalPayableAmount: number;
        
        TotalTaxInclusiveAmount: number;
        
        TotalTurkishCurrencyEquivalent: number;
        
        XsltTemplate: Buffer;
    }
    export interface ICurrencyInvoices {
        CurrencyInvoice: InvoiceServiceBasicHttpEndpointTypes.ICurrencyInvoice[];
    }
    export interface ISendCurrencyInvoiceResult {

        ErrorMessage: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ResultType(Success,Failed) */
        Result: "Success" | "Failed";
        Invoices: {
            InvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReturn[];
        };
    }
    export interface ISendCurrencyInvoiceApiResult {

        ErrorMessage: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ResultType(Success,Failed) */
        Result: "Success" | "Failed";
        Invoices: {
            InvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReturn[];
        };
    }
    export interface IArchiveInvoiceDetail {
        AdditionalTaxes: InvoiceServiceBasicHttpEndpointTypes.IAdditionalTaxes;

        CurrencyCode: string;
        
        DiscountAmount: number;
        
        DiscountRate: number;
        
        LineExtensionAmount: number;

        Note: string;

        OwnerIdentificationNumber: string;

        OwnerName: string;
        Product: InvoiceServiceBasicHttpEndpointTypes.IProduct;
        
        Quantity: number;
        
        SpecialBasisAmount: number;
        
        SpecialBasisPercent: number;

        SpecialBasisReasonCode: string;
        
        SpecialBasisTaxAmount: number;

        StockDescription: string;

        TagNumber: string;

        TaxExemptionReason: string;

        TaxExemptionReasonCode: string;
        
        VATAmount: number;
        
        VATRate: number;
        WitholdingTaxes: InvoiceServiceBasicHttpEndpointTypes.IWitholdingTaxes;
    }
    export interface ICarrier {
        
        CarrierId: number;

        CarrierName: string;

        VknTckn: string;
    }
    export interface IWebSellingInfo {
        Carrier: InvoiceServiceBasicHttpEndpointTypes.ICarrier;

        OtherPaymentType: string;
        
        PaymentDate: Date;

        PaymentMediatorName: string;
        PaymentType: any;
        
        SendingDate: Date;

        WebAddress: string;
    }
    export interface IArchiveInvoice {

        AccountingCost: string;
        
        ApprovalDate: Date;
        ApprovalStatus: any;

        ArchiveCancellationReportNumber: string;
        
        ArchiveDate: Date;

        ArchiveInvoiceExternalUrl: string;

        ArchiveReportNumber: string;
        BankAccountList: Array<number>;
        CancellationReportSendingStatus: any;
        CompanyBranchAddress: InvoiceServiceBasicHttpEndpointTypes.ICompanyBranchAddress;
        
        CrossRate: number;
        
        CrossRateDate: Date;

        CurrencyCode: string;
        DispatchList: InvoiceServiceBasicHttpEndpointTypes.IDispatchList;

        ETTN: string;

        ExportRegisteredReasonCode: string;

        ExternalArchiveInvoiceCode: string;

        InstallationNumber: string;
        InvoiceAdditionalIdentityInfo: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAdditionalIdentityInfo;
        InvoiceAttachments: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAttachments;
        
        InvoiceCreationDate: Date;
        
        InvoiceDate: Date;
        InvoiceDetails: {
            ArchiveInvoiceDetail: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceDetail[];
        };
        InvoiceExpenses: InvoiceServiceBasicHttpEndpointTypes.IInvoiceExpenses;

        InvoiceNumber: string;
        
        InvoicePdf: Buffer;
        InvoiceTotalTaxList: InvoiceServiceBasicHttpEndpointTypes.IInvoiceTotalTaxList;
        InvoiceType: "SATIS" | "IADE" | "ISTISNA" | "TEVKIFAT" | "OZELMATRAH" | "IHRACKAYITLI" | "SGK" | "KOMISYONCU" | "TEVKIFATIADE";
        
        InvoiceXml: Buffer;

        IsArchived: boolean;
        
        LastPaymentDate: Date;
        Notes: Array<string>;
        
        OrderDate: Date;

        OrderNumber: string;
        Payment: InvoiceServiceBasicHttpEndpointTypes.IPayment;
        Receiver: InvoiceServiceBasicHttpEndpointTypes.IReceiver;
        ReceiverBranchAddress: InvoiceServiceBasicHttpEndpointTypes.IReceiverBranchAddress;
        ReportSendingStatus: any;
        ReturnInvoiceDate: Date;

        ReturnInvoiceNumber: string;

        ReturnReason: string;

        SendMailAutomatically: boolean;
        SendingStatus: any;
        Status: any;

        TaxExemptionReason: string;
        
        TotalDiscountAmount: number;
        
        TotalLineExtensionAmount: number;
        
        TotalPayableAmount: number;
        
        TotalTaxInclusiveAmount: number;
        
        TotalVATAmount: number;
        WebSellingInfo: InvoiceServiceBasicHttpEndpointTypes.IWebSellingInfo;
        
        XsltTemplate: Buffer;
    }
    export interface IArchiveInvoiceReturn {
        ArchiveInvoiceNumber: string;
        Ettn: string;
        ExternalArchiveInvoiceCode: string;
    }
    export interface ISendArchiveInvoiceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ArchiveInvoices: {
            ArchiveInvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceReturn[];
        };
    }
    export interface ISendArchiveInvoiceApiResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ArchiveInvoices: {
            ArchiveInvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceReturn[];
        };
    }
    export interface IArchiveInvoiceXml {
        ArchiveInvoiceContent: Buffer;
        SendMailAutomatically: boolean;
    }
    export interface ISendArchiveInvoiceXmlResult {

        ErrorMessage: string;
        Result: "Success" | "Failed";
        ArchiveInvoices: {
            ArchiveInvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceReturn[];
        };
    }
    export interface ISendArchiveInvoiceXmlWithoutInvoiceNumberResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ArchiveInvoices: {
            ArchiveInvoiceReturn: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceReturn[];
        };
    }
    export interface IInvoiceReply {
        InvoiceETTN: string;
        InvoiceResponse: "KABUL" | "RED";
        InvoiceResponseDescription: string;
    }
    export interface IInvoiceReplies {
        InvoiceReply: InvoiceServiceBasicHttpEndpointTypes.IInvoiceReply[];
    }
    export interface ISendInvoiceReplyResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface IBaseInvoiceReply {
        BaseInvoiceResponse: "KABUL" | "RED" | "IADE_EDILDI";
        InvoiceETTN: string;
    }
    export interface IBaseInvoiceReplies {
        BaseInvoiceReply: InvoiceServiceBasicHttpEndpointTypes.IBaseInvoiceReply[];
    }
    export interface IUpdateInvoiceStateResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface IDirectInvoiceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface IExcludeDetailStatusList {
        InvoiceDetailStatus: Array<"Zarflanmadi" | "Zarf_Kuyruga_Eklendi" | "Zarf_Isleniyor" | "Zip_Dosyasi_Degil" | "ZarfId_Uzunlugu_Gecersiz" | "Zarf_Arsivden_Kopyalanamadi" | "Zip_Acilamadi" | "Zip_Bir_Dosya_Icermeli" | "XML_Dosyasi_Degil" | "Zarf_ID_Ve_XML_Dosyasinin_Adi_Ayni_Olmali" | "Dokuman_Ayristirilamadi" | "Zarf_ID_Yok" | "Zarf_ID_VE_Zip_Dosyasi_Adi_Ayni_Olmali" | "Gecersiz_Versiyon" | "Schematron_Kontrol_Sonucu_Hatali" | "Xml_Sema_Kontrolundan_Gecemedi" | "Imza_Sahibi_TCKN_VKN_Alinamadi" | "Imza_Kaydedilemedi" | "Gonderilen_Zarf_Kayitli_bir_Fatura_Icermelidir" | "Gonderilen_Zarf_Kayitli_bir_Belge_Icermektedir" | "Yetki_Kontrol_Edilemedi" | "Gonderici_Birim_Yetkisi_Yok" | "Posta_Kutusu_Yetkisi_Yok" | "Islem_Yetkisi_Yok" | "Imza_Yetkisi_Kontrol_Edilemedi" | "Imza_Sahibi_Yetkisi" | "Gecersiz_Imza" | "Adres_Kontrol_Edilemedi" | "Adres_Bulunamadi" | "Kullanici_Eklenemedi" | "Kullanici_Silinemedi" | "Sistem_Yaniti_Hazirlanamadi" | "Sistem_Hatasi" | "Zarf_Basariyla_Islendi" | "Dokuman_Bulunan_Adrese_Gonderilemedi" | "Dokuman_Gonderimi_Basarisiz_Tekrar_Gonderme_Sonlandi" | "Hedeften_Sistem_Yaniti_Gelmedi" | "Hedeften_Sistem_Yaniti_Basarisiz_Geldi" | "Fatura_Iptale_Konu_Edildi" | "Basariyla_Tamamlandi">;
    }
    export interface IExcludeStatusList {
        InvoiceStatus: Array<"Onay_Bekliyor" | "Onaylandi" | "Reddedildi" | "Onay_Akisinda" | "Iade_Edildi" | "Gonderildi" | "Ziplendi" | "Gibe_Iletildi" | "Imza_Bekliyor" | "Gib_Tarafinda_Hata_Olustu" | "Sistem_Hatasi" | "Alici_Kabul_Etti" | "Alici_Reddetti" | "Alici_Iade_Etti" | "Otomatik_Onaylandi" | "Otomatik_Alici_Kabul_Etti" | "Uygulama_Yaniti_Yollaniyor" | "Uygulama_Yaniti_Hata_Aldi" | "Irsaliye_Yaniti_Yollaniyor" | "Irsaliye_Yaniti_Hata_Aldi">;
    }
    export interface IIncludeDetailStatusList {
        InvoiceDetailStatus: Array<"Zarflanmadi" | "Zarf_Kuyruga_Eklendi" | "Zarf_Isleniyor" | "Zip_Dosyasi_Degil" | "ZarfId_Uzunlugu_Gecersiz" | "Zarf_Arsivden_Kopyalanamadi" | "Zip_Acilamadi" | "Zip_Bir_Dosya_Icermeli" | "XML_Dosyasi_Degil" | "Zarf_ID_Ve_XML_Dosyasinin_Adi_Ayni_Olmali" | "Dokuman_Ayristirilamadi" | "Zarf_ID_Yok" | "Zarf_ID_VE_Zip_Dosyasi_Adi_Ayni_Olmali" | "Gecersiz_Versiyon" | "Schematron_Kontrol_Sonucu_Hatali" | "Xml_Sema_Kontrolundan_Gecemedi" | "Imza_Sahibi_TCKN_VKN_Alinamadi" | "Imza_Kaydedilemedi" | "Gonderilen_Zarf_Kayitli_bir_Fatura_Icermelidir" | "Gonderilen_Zarf_Kayitli_bir_Belge_Icermektedir" | "Yetki_Kontrol_Edilemedi" | "Gonderici_Birim_Yetkisi_Yok" | "Posta_Kutusu_Yetkisi_Yok" | "Islem_Yetkisi_Yok" | "Imza_Yetkisi_Kontrol_Edilemedi" | "Imza_Sahibi_Yetkisi" | "Gecersiz_Imza" | "Adres_Kontrol_Edilemedi" | "Adres_Bulunamadi" | "Kullanici_Eklenemedi" | "Kullanici_Silinemedi" | "Sistem_Yaniti_Hazirlanamadi" | "Sistem_Hatasi" | "Zarf_Basariyla_Islendi" | "Dokuman_Bulunan_Adrese_Gonderilemedi" | "Dokuman_Gonderimi_Basarisiz_Tekrar_Gonderme_Sonlandi" | "Hedeften_Sistem_Yaniti_Gelmedi" | "Hedeften_Sistem_Yaniti_Basarisiz_Geldi" | "Fatura_Iptale_Konu_Edildi" | "Basariyla_Tamamlandi">;
    }
    export interface IIncludeStatusList {
        InvoiceStatus: Array<"Onay_Bekliyor" | "Onaylandi" | "Reddedildi" | "Onay_Akisinda" | "Iade_Edildi" | "Gonderildi" | "Ziplendi" | "Gibe_Iletildi" | "Imza_Bekliyor" | "Gib_Tarafinda_Hata_Olustu" | "Sistem_Hatasi" | "Alici_Kabul_Etti" | "Alici_Reddetti" | "Alici_Iade_Etti" | "Otomatik_Onaylandi" | "Otomatik_Alici_Kabul_Etti" | "Uygulama_Yaniti_Yollaniyor" | "Uygulama_Yaniti_Hata_Aldi" | "Irsaliye_Yaniti_Yollaniyor" | "Irsaliye_Yaniti_Hata_Aldi">;
    }
    export interface IPagingRequest {
        PageNumber: number;
        RecordsPerPage: number;
    }
    export interface IPagingResponse {
        PageNumber: number;
        RecordsPerPage: number;
        TotalNumberOfPages: number;
        TotalNumberOfRecords: number;
    }
    export interface ISearchInvoiceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        Invoices: {
            Invoice: InvoiceServiceBasicHttpEndpointTypes.IInvoice[];
        };
        PagingResponse: InvoiceServiceBasicHttpEndpointTypes.IPagingResponse;
    }
    export interface ISearchAllInvoiceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        Invoices: {
            Invoice: InvoiceServiceBasicHttpEndpointTypes.IInvoice[];
        };
        PagingResponse: InvoiceServiceBasicHttpEndpointTypes.IPagingResponse;
    }
    export interface ISearchExternalInvoiceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        Invoices: Array<any>;
    }
    export interface ISearchArchiveInvoiceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ArchiveInvoices: {
            ArchiveInvoice: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoice[];
        };
        PagingResponse: InvoiceServiceBasicHttpEndpointTypes.IPagingResponse;
    }
    export interface IArchiveInvoiceResult {

        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface IDeArchiveInvoiceResult {

        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface IArchiveInvoiceCancellation {
        CancellationReason: string;
        ETTN: string;
    }
    export interface IArchiveInvoiceList {
        ArchiveInvoiceCancellation: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceCancellation[];
    }
    export interface ICancelArchiveInvoiceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface ISendArchiveInvoiceReportResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";

        ArchiveInvoiceReportGroupNumber: string;
    }
    export interface IArchiveInvoiceReport {
        ArchiveInvoiceReportGroupNumber: string;
        ArchiveInvoiceReportNumber: string;
        InvoiceEttnList: Array<string>;
        Status: any;
    }
    export interface IArchiveInvoiceReportList {
        ArchiveInvoiceReport: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceReport[];
    }
    export interface ISearchArchiveInvoiceReportResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ArchiveInvoiceReportList: InvoiceServiceBasicHttpEndpointTypes.IArchiveInvoiceReportList;
    }
    export interface ISendArchiveInvoiceMailResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface IGetEttnListResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        Count: number;
        EttnList: Array<string>;
    }
    export interface IAbbreviationReport {

        CancelStatus: boolean;
        
        InvoiceCount: number;
        
        ReportDate: Date;

        ReportNo: string;
        
        Total: number;
        
        TotalTax0: number;
        
        TotalTax1: number;
        
        TotalTax18: number;
        
        TotalTax8: number;
        
        TotalTaxBasis0: number;
        
        TotalTaxBasis1: number;
        
        TotalTaxBasis18: number;
        
        TotalTaxBasis8: number;
    }
    export interface IGetAbbreviationReportResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        Reports: {
            AbbreviationReport: InvoiceServiceBasicHttpEndpointTypes.IAbbreviationReport[];
        };
    }
    export interface IAbbreviationDetailReport {
        InvoiceNumber: string;
        ReportNo: string;
        
        Total: number;
        
        TotalTax0: number;
        
        TotalTax1: number;
        
        TotalTax18: number;
        
        TotalTax8: number;
        
        TotalTaxBasis0: number;
        
        TotalTaxBasis1: number;
        
        TotalTaxBasis18: number;
        
        TotalTaxBasis8: number;
    }
    export interface IGetAbbreviationDetailReportResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        Reports: {
            AbbreviationDetailReport: InvoiceServiceBasicHttpEndpointTypes.IAbbreviationDetailReport[];
        };
    }
    export interface ICreateReturnReceiptResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        
        PdfFile: Buffer;
        
        ReturnReceiptHtml: Buffer;

        ReturnReceiptNumber: string;
    }
    export interface IBuyerCustomerParty {
        Address: InvoiceServiceBasicHttpEndpointTypes.IAddress;

        ExternalReceiverCode: string;

        InstallationNumber: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        RecipientType: any
        SendingType: any

        VendorNumber: string;
    }
    export interface IDeliveryCustomerParty {
        Address: InvoiceServiceBasicHttpEndpointTypes.IAddress;

        ExternalReceiverCode: string;

        InstallationNumber: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        RecipientType: any
        SendingType: any

        VendorNumber: string;
    }
    export interface IDespatchAdviceAttachments {
        InvoiceAttachment: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAttachment[];
    }
    export interface IDespatchAdviceDetail {

        CurrencyCode: string;
        DeliveryList: InvoiceServiceBasicHttpEndpointTypes.IDeliveryList;

        ImprintNumber: string;

        Note: string;
        
        OverSentQuantity: number;
        Product: InvoiceServiceBasicHttpEndpointTypes.IProduct;

        RelatedOrderLineNumber: string;
        
        SentQuantity: number;

        StockDescription: string;
        
        ToBeSentQuantity: number;

        ToBeSentQuantityReason: string;
    }
    export interface IDespatchAdviceDetails {
        DespatchAdviceDetail: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceDetail[];
    }
    export interface IDespatchSupplierParty {
        Address: InvoiceServiceBasicHttpEndpointTypes.IAddress;

        ExternalReceiverCode: string;

        InstallationNumber: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        RecipientType: any
        SendingType: any

        VendorNumber: string;
    }
    export interface IOriginatorCustomerParty {
        Address: InvoiceServiceBasicHttpEndpointTypes.IAddress;

        ExternalReceiverCode: string;

        InstallationNumber: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        RecipientType: any
        SendingType: any

        VendorNumber: string;
    }
    export interface IPrintedDocumentInfo {
        
        PrintedDocumentDate: Date;

        PrintedDocumentOrderNumber: string;

        PrintedDocumentSerialNumber: string;

        PrintedStaticValue: string;
    }
    export interface ISellerSupplierParty {
        Address: InvoiceServiceBasicHttpEndpointTypes.IAddress;

        ExternalReceiverCode: string;

        InstallationNumber: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q6:RecipientType(undefined) */
        RecipientType: any
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q7:SendingType(undefined) */
        SendingType: any

        VendorNumber: string;
    }
    export interface ICarrierParty {
        Address: InvoiceServiceBasicHttpEndpointTypes.IAddress;

        ExternalReceiverCode: string;

        InstallationNumber: string;

        ReceiverName: string;

        ReceiverTaxCode: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q6:RecipientType(undefined) */
        RecipientType: any
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#q7:SendingType(undefined) */
        SendingType: any

        VendorNumber: string;
    }
    export interface IPerson {

        FamilyName: string;

        FirstName: string;

        NationalityId: string;

        Title: string;
    }
    export interface IDriverPersonList {
        Person: InvoiceServiceBasicHttpEndpointTypes.IPerson[];
    }
    export interface IDespatchAdviceShipmentStage {
        DriverPersonList: InvoiceServiceBasicHttpEndpointTypes.IDriverPersonList;
        ShipmentTransportMeans: InvoiceServiceBasicHttpEndpointTypes.IShipmentTransportMeans;
    }
    export interface IDespatchAdvice {
        AdditionalDocumentReferences: InvoiceServiceBasicHttpEndpointTypes.IAdditionalDocumentReferences;
        
        ArchiveDate: Date;
        BuyerCustomerParty: InvoiceServiceBasicHttpEndpointTypes.IBuyerCustomerParty;

        CompanyVendorNumber: string;
        
        CrossRate: number;
        
        CrossRateDate: Date;

        CurrencyCode: string;
        DeliveryCustomerParty: InvoiceServiceBasicHttpEndpointTypes.IDeliveryCustomerParty;
        DespatchAdviceAttachments: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceAttachments;
        
        DespatchAdviceCreationDate: Date;
        
        DespatchAdviceDate: Date;
        DespatchAdviceDetails: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceDetails;
        
        DespatchAdviceHtml: Buffer;

        DespatchAdviceNumber: string;
        
        DespatchAdvicePdf: Buffer;
        DespatchAdviceScenarioType: "TEMELIRSALIYE";
        DespatchAdviceType: "SEVK" | "MATBUDAN";
        
        DespatchAdviceXml: Buffer;
        DespatchSupplierParty: InvoiceServiceBasicHttpEndpointTypes.IDespatchSupplierParty;
        DetailStatus: "Zarflanmadi" | "Zarf_Kuyruga_Eklendi" | "Zarf_Isleniyor" | "Zip_Dosyasi_Degil" | "ZarfId_Uzunlugu_Gecersiz" | "Zarf_Arsivden_Kopyalanamadi" | "Zip_Acilamadi" | "Zip_Bir_Dosya_Icermeli" | "XML_Dosyasi_Degil" | "Zarf_ID_Ve_XML_Dosyasinin_Adi_Ayni_Olmali" | "Dokuman_Ayristirilamadi" | "Zarf_ID_Yok" | "Zarf_ID_VE_Zip_Dosyasi_Adi_Ayni_Olmali" | "Gecersiz_Versiyon" | "Schematron_Kontrol_Sonucu_Hatali" | "Xml_Sema_Kontrolundan_Gecemedi" | "Imza_Sahibi_TCKN_VKN_Alinamadi" | "Imza_Kaydedilemedi" | "Gonderilen_Zarf_Kayitli_bir_Fatura_Icermelidir" | "Gonderilen_Zarf_Kayitli_bir_Belge_Icermektedir" | "Yetki_Kontrol_Edilemedi" | "Gonderici_Birim_Yetkisi_Yok" | "Posta_Kutusu_Yetkisi_Yok" | "Islem_Yetkisi_Yok" | "Imza_Yetkisi_Kontrol_Edilemedi" | "Imza_Sahibi_Yetkisi" | "Gecersiz_Imza" | "Adres_Kontrol_Edilemedi" | "Adres_Bulunamadi" | "Kullanici_Eklenemedi" | "Kullanici_Silinemedi" | "Sistem_Yaniti_Hazirlanamadi" | "Sistem_Hatasi" | "Zarf_Basariyla_Islendi" | "Dokuman_Bulunan_Adrese_Gonderilemedi" | "Dokuman_Gonderimi_Basarisiz_Tekrar_Gonderme_Sonlandi" | "Hedeften_Sistem_Yaniti_Gelmedi" | "Hedeften_Sistem_Yaniti_Basarisiz_Geldi" | "Fatura_Iptale_Konu_Edildi" | "Basariyla_Tamamlandi";

        ETTN: string;

        EnvelopeId: string;

        ExternalDespatchAdviceCode: string;
        FinancialAccount: {
            FinancialAccount: Array<{

                Currency: string;

                Iban: string;

                PaymentNote: string;
            }>;
        };

        IsArchived: boolean;
        Notes: Array<string>;
        
        OrderDate: Date;

        OrderNumber: string;
        OriginatorCustomerParty: InvoiceServiceBasicHttpEndpointTypes.IOriginatorCustomerParty;
        PrintedDocumentInfo: InvoiceServiceBasicHttpEndpointTypes.IPrintedDocumentInfo;

        ReceiverInboxTag: string;

        RejectReason: string;
        SellerSupplierParty: InvoiceServiceBasicHttpEndpointTypes.ISellerSupplierParty;
        Shipment: {
            Delivery: {
                
                ActualDespatchDate: Date;
                CarrierParty: InvoiceServiceBasicHttpEndpointTypes.ICarrierParty;
            };
            ShipmentStageList: {
                DespatchAdviceShipmentStage: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceShipmentStage[];
            };
            
            TotalValueAmount: number;
            TransportEquipmentPlateList: Array<string>;
        };
        Status: "Onay_Bekliyor" | "Onaylandi" | "Reddedildi" | "Onay_Akisinda" | "Iade_Edildi" | "Gonderildi" | "Ziplendi" | "Gibe_Iletildi" | "Imza_Bekliyor" | "Gib_Tarafinda_Hata_Olustu" | "Sistem_Hatasi" | "Alici_Kabul_Etti" | "Alici_Reddetti" | "Alici_Iade_Etti" | "Otomatik_Onaylandi" | "Otomatik_Alici_Kabul_Etti" | "Uygulama_Yaniti_Yollaniyor" | "Uygulama_Yaniti_Hata_Aldi" | "Irsaliye_Yaniti_Yollaniyor" | "Irsaliye_Yaniti_Hata_Aldi";

        SystemResponseDescription: string;
        
        XsltTemplate: Buffer;
    }
    export interface IDespatchAdviceReturn {

        DespatchAdviceNumber: string;

        Ettn: string;

        ExternalDespatchAdviceCode: string;
    }
    export interface ISendDespatchAdviceResult {

        ErrorMessage: string;
        Result: "Success" | "Failed";
        DespatchAdvices: {
            DespatchAdviceReturn: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceReturn[];
        };
    }
    export interface IDespatchAdviceXml {
        
        DespatchAdviceContent: Buffer;

        ReceiverTag: string;
    }
    export interface ISendDespatchAdviceXmlResult {

        ErrorMessage: string;
        /** http://schemas.datacontract.org/2004/07/EInvoice.Service.Model#ResultType(Success,Failed) */
        Result: "Success" | "Failed";
        DespatchAdvices: {
            DespatchAdviceReturn: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceReturn[];
        };
    }
    export interface ISendDespatchAdviceXmlWithoutDespatchAdviceNumberResult {

        ErrorMessage: string;
        Result: "Success" | "Failed";
        DespatchAdvices: {
            DespatchAdviceReturn: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdviceReturn[];
        };
    }
    export interface ISearchDespatchAdviceResult {

        ErrorMessage: string;
        Result: "Success" | "Failed";
        DespatchAdvices: {
            DespatchAdvice: InvoiceServiceBasicHttpEndpointTypes.IDespatchAdvice[];
        };
        PagingResponse: InvoiceServiceBasicHttpEndpointTypes.IPagingResponse;
    }
    export interface IReceiptAdviceAttachments {
        InvoiceAttachment: InvoiceServiceBasicHttpEndpointTypes.IInvoiceAttachment[];
    }
    export interface IReceiptAdviceDetail {

        CurrencyCode: string;
        DeliveryList: InvoiceServiceBasicHttpEndpointTypes.IDeliveryList;
        Notes: Array<string>;
        
        OversupplyQuantity: number;
        Product: InvoiceServiceBasicHttpEndpointTypes.IProduct;
        
        ReceivedDate: Date;
        
        ReceivedQuantity: number;

        RejectReasonCode: string;
        RejectReasons: Array<string>;
        
        RejectedQuantity: number;

        RelatedDespatchLineNumber: string;

        RelatedOrderLineNumber: string;
        
        ShortQuantity: number;

        StockDescription: string;

        TimingComplaint: string;

        TimingComplaintCode: string;
    }
    export interface IReceiptAdviceDetails {
        ReceiptAdviceDetail: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceDetail[];
    }
    export interface IReceiptAdvice {
        AdditionalDocumentReferences: InvoiceServiceBasicHttpEndpointTypes.IAdditionalDocumentReferences;
        ArchiveDate: Date;
        BuyerCustomerParty: InvoiceServiceBasicHttpEndpointTypes.IBuyerCustomerParty;
        CompanyVendorNumber: string;
        CrossRate: number;
        CrossRateDate: Date;
        CurrencyCode: string;
        DeliveryCustomerParty: InvoiceServiceBasicHttpEndpointTypes.IDeliveryCustomerParty;
        DespatchSupplierParty: InvoiceServiceBasicHttpEndpointTypes.IDespatchSupplierParty;
        DetailStatus: "Zarflanmadi" | "Zarf_Kuyruga_Eklendi" | "Zarf_Isleniyor" | "Zip_Dosyasi_Degil" | "ZarfId_Uzunlugu_Gecersiz" | "Zarf_Arsivden_Kopyalanamadi" | "Zip_Acilamadi" | "Zip_Bir_Dosya_Icermeli" | "XML_Dosyasi_Degil" | "Zarf_ID_Ve_XML_Dosyasinin_Adi_Ayni_Olmali" | "Dokuman_Ayristirilamadi" | "Zarf_ID_Yok" | "Zarf_ID_VE_Zip_Dosyasi_Adi_Ayni_Olmali" | "Gecersiz_Versiyon" | "Schematron_Kontrol_Sonucu_Hatali" | "Xml_Sema_Kontrolundan_Gecemedi" | "Imza_Sahibi_TCKN_VKN_Alinamadi" | "Imza_Kaydedilemedi" | "Gonderilen_Zarf_Kayitli_bir_Fatura_Icermelidir" | "Gonderilen_Zarf_Kayitli_bir_Belge_Icermektedir" | "Yetki_Kontrol_Edilemedi" | "Gonderici_Birim_Yetkisi_Yok" | "Posta_Kutusu_Yetkisi_Yok" | "Islem_Yetkisi_Yok" | "Imza_Yetkisi_Kontrol_Edilemedi" | "Imza_Sahibi_Yetkisi" | "Gecersiz_Imza" | "Adres_Kontrol_Edilemedi" | "Adres_Bulunamadi" | "Kullanici_Eklenemedi" | "Kullanici_Silinemedi" | "Sistem_Yaniti_Hazirlanamadi" | "Sistem_Hatasi" | "Zarf_Basariyla_Islendi" | "Dokuman_Bulunan_Adrese_Gonderilemedi" | "Dokuman_Gonderimi_Basarisiz_Tekrar_Gonderme_Sonlandi" | "Hedeften_Sistem_Yaniti_Gelmedi" | "Hedeften_Sistem_Yaniti_Basarisiz_Geldi" | "Fatura_Iptale_Konu_Edildi" | "Basariyla_Tamamlandi";
        ETTN: string;
        EnvelopeId: string;
        ExternalReceiptAdviceCode: string;
        IsArchived: boolean;
        Notes: Array<string>;
        OrderDate: Date;
        OrderNumber: string;
        ReceiptAdviceAttachments: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceAttachments;
        ReceiptAdviceCreationDate: Date;
        ReceiptAdviceDate: Date;
        ReceiptAdviceDetails: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceDetails;
        ReceiptAdviceHtml: Buffer;
        ReceiptAdviceNumber: string;
        ReceiptAdvicePdf: Buffer;
        ReceiptAdviceScenarioType: "TEMELIRSALIYE";
        ReceiptAdviceType: "SEVK";
        ReceiptAdviceXml: Buffer;
        ReceiverInboxTag: string;
        RelatedDespatchAdviceEttn: string;
        SellerSupplierParty: InvoiceServiceBasicHttpEndpointTypes.ISellerSupplierParty;
        Shipment: {
            Delivery: {};
        };
        Status: "Onay_Bekliyor" | "Onaylandi" | "Reddedildi" | "Onay_Akisinda" | "Iade_Edildi" | "Gonderildi" | "Ziplendi" | "Gibe_Iletildi" | "Imza_Bekliyor" | "Gib_Tarafinda_Hata_Olustu" | "Sistem_Hatasi" | "Alici_Kabul_Etti" | "Alici_Reddetti" | "Alici_Iade_Etti" | "Otomatik_Onaylandi" | "Otomatik_Alici_Kabul_Etti" | "Uygulama_Yaniti_Yollaniyor" | "Uygulama_Yaniti_Hata_Aldi" | "Irsaliye_Yaniti_Yollaniyor" | "Irsaliye_Yaniti_Hata_Aldi";
        SystemResponseDescription: string;
        XsltTemplate: Buffer;
    }
    export interface IReceiptAdviceReturn {
        Ettn: string;
        ExternalReceiptAdviceCode: string;
        ReceiptAdviceNumber: string;
    }
    export interface ISendReceiptAdviceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ReceiptAdvices: {
            ReceiptAdviceReturn: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceReturn[];
        };
    }
    export interface IReceiptAdviceXml {
        ReceiptAdviceContent: Buffer;
        ReceiverTag: string;
    }
    export interface ISendReceiptAdviceXmlResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ReceiptAdvices: {
            ReceiptAdviceReturn: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceReturn[];
        };
    }
    export interface ISendReceiptAdviceXmlWithoutReceiptAdviceNumberResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ReceiptAdvices: {
            ReceiptAdviceReturn: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdviceReturn[];
        };
    }
    export interface ISearchReceiptAdviceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        PagingResponse: InvoiceServiceBasicHttpEndpointTypes.IPagingResponse;
        ReceiptAdvices: {
            ReceiptAdvice: InvoiceServiceBasicHttpEndpointTypes.IReceiptAdvice[];
        };
    }
    export interface ISendESMMResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        DocumentNumber: string;
        Ettn: string;
        ExternalESMMCode: string;
    }
    export interface ISendESMMXmlResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        DocumentNumber: string;
        Ettn: string;
        ExternalESMMCode: string;
    }
    export interface ISearchESMMResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        ESMM: Array<IESMM>;
        PagingResponse: InvoiceServiceBasicHttpEndpointTypes.IPagingResponse;
    }
    export interface IESMM {

        CancellationReason: string;

        ETTN: string;
    }
    export interface ICancelESMMResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
    }
    export interface IGetCompanyBalanceResult {
        ErrorMessage: string;
        Result: "Success" | "Failed";
        Balance: number;
    }
}
