import { AdditionalDocumentReferences } from "./AdditionalDocumentReferences";
import { CompanyBranchAddress } from "./CompanyBranchAddress";
import { Delivery } from "./Delivery";
import { DispatchList } from "./DispatchList";
import { ExportReceiver } from "./ExportReceiver";
import { FinancialAccount } from "./FinancialAccount";
import { InvoiceAdditionalIdentityInfo } from "./InvoiceAdditionalIdentityInfo";
import { InvoiceAttachments } from "./InvoiceAttachments";
import { InvoiceDetails } from "./InvoiceDetails";
import { InvoiceExpenses } from "./InvoiceExpenses";
import { AdditionalTaxes } from "./AdditionalTaxes";
import { Payment } from "./Payment";
import { PublicReceiver } from "./PublicReceiver";
import { Receiver } from "./Receiver";
import { RepresentativeParty } from "./RepresentativeParty";
import { Tourist } from "./Tourist";

/**
 * Invoice
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface Invoice {
    /** xs:string */
    AccountingCost?: string;
    /** xs:dateTime */
    ActualExportDate?: string;
    /** AdditionalDocumentReferences */
    AdditionalDocumentReferences?: AdditionalDocumentReferences;
    /** xs:string */
    AliciBayiNo?: string;
    /** xs:string */
    ApplicationResponseDescription?: string;
    /** InvoiceStatus|xs:string|Onay_Bekliyor,Onaylandi,Reddedildi,Onay_Akisinda,Iade_Edildi,Gonderildi,Ziplendi,Gibe_Iletildi,Imza_Bekliyor,Gib_Tarafinda_Hata_Olustu,Sistem_Hatasi,Alici_Kabul_Etti,Alici_Reddetti,Alici_Iade_Etti,Otomatik_Onaylandi,Otomatik_Alici_Kabul_Etti,Uygulama_Yaniti_Yollaniyor,Uygulama_Yaniti_Hata_Aldi,Irsaliye_Yaniti_Yollaniyor,Irsaliye_Yaniti_Hata_Aldi */
    ApplicationResponseStatus?: string;
    /** xs:dateTime */
    ApprovalDate?: string;
    /** xs:dateTime */
    ArchiveDate?: string;
    /** q1:ArrayOfdecimal */
    BankAccountList?: string;
    /** CompanyBranchAddress */
    CompanyBranchAddress?: CompanyBranchAddress;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:decimal */
    CrossRate?: string;
    /** xs:dateTime */
    CrossRateDate?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** Delivery */
    Delivery?: Delivery;
    /** InvoiceDetailStatus|xs:string|Zarflanmadi,Zarf_Kuyruga_Eklendi,Zarf_Isleniyor,Zip_Dosyasi_Degil,ZarfId_Uzunlugu_Gecersiz,Zarf_Arsivden_Kopyalanamadi,Zip_Acilamadi,Zip_Bir_Dosya_Icermeli,XML_Dosyasi_Degil,Zarf_ID_Ve_XML_Dosyasinin_Adi_Ayni_Olmali,Dokuman_Ayristirilamadi,Zarf_ID_Yok,Zarf_ID_VE_Zip_Dosyasi_Adi_Ayni_Olmali,Gecersiz_Versiyon,Schematron_Kontrol_Sonucu_Hatali,Xml_Sema_Kontrolundan_Gecemedi,Imza_Sahibi_TCKN_VKN_Alinamadi,Imza_Kaydedilemedi,Gonderilen_Zarf_Kayitli_bir_Fatura_Icermelidir,Gonderilen_Zarf_Kayitli_bir_Belge_Icermektedir,Yetki_Kontrol_Edilemedi,Gonderici_Birim_Yetkisi_Yok,Posta_Kutusu_Yetkisi_Yok,Islem_Yetkisi_Yok,Imza_Yetkisi_Kontrol_Edilemedi,Imza_Sahibi_Yetkisi,Gecersiz_Imza,Adres_Kontrol_Edilemedi,Adres_Bulunamadi,Kullanici_Eklenemedi,Kullanici_Silinemedi,Sistem_Yaniti_Hazirlanamadi,Sistem_Hatasi,Zarf_Basariyla_Islendi,Dokuman_Bulunan_Adrese_Gonderilemedi,Dokuman_Gonderimi_Basarisiz_Tekrar_Gonderme_Sonlandi,Hedeften_Sistem_Yaniti_Gelmedi,Hedeften_Sistem_Yaniti_Basarisiz_Geldi,Fatura_Iptale_Konu_Edildi,Basariyla_Tamamlandi */
    DetailStatus?: string;
    /** xs:dateTime */
    DirectionDate?: string;
    /** DispatchList */
    DispatchList?: DispatchList;
    /** xs:string */
    ETTN?: string;
    /** xs:string */
    EnvelopeId?: string;
    /** ExportReceiver */
    ExportReceiver?: ExportReceiver;
    /** xs:string */
    ExportRegisteredReasonCode?: string;
    /** xs:string */
    ExternalInvoiceCode?: string;
    /** FinancialAccount */
    FinancialAccount?: FinancialAccount;
    /** xs:string */
    GcbRegistrationNumber?: string;
    /** xs:string */
    GtbReferenceNumber?: string;
    /** xs:decimal */
    IdRepresentative?: string;
    /** InvoiceAdditionalIdentityInfo */
    InvoiceAdditionalIdentityInfo?: InvoiceAdditionalIdentityInfo;
    /** InvoiceAttachments */
    InvoiceAttachments?: InvoiceAttachments;
    /** xs:dateTime */
    InvoiceCreationDate?: string;
    /** xs:dateTime */
    InvoiceDate?: string;
    /** InvoiceDetails */
    InvoiceDetails?: InvoiceDetails;
    /** InvoiceExpenses */
    InvoiceExpenses?: InvoiceExpenses;
    /** xs:string */
    InvoiceExternalUrl?: string;
    /** xs:base64Binary */
    InvoiceHtml?: string;
    /** xs:string */
    InvoiceNumber?: string;
    /** xs:base64Binary */
    InvoicePdf?: string;
    /** xs:dateTime */
    InvoicePeriodEndDate?: string;
    /** xs:dateTime */
    InvoicePeriodStartDate?: string;
    /** InvoiceSenderAdditionalIdentityInfo */
    InvoiceSenderAdditionalIdentityInfo?: InvoiceAdditionalIdentityInfo;
    /** InvoiceTotalTaxList */
    InvoiceTotalTaxList?: AdditionalTaxes;
    /** InvoiceType|xs:string|SATIS,IADE,ISTISNA,TEVKIFAT,OZELMATRAH,IHRACKAYITLI,SGK,KOMISYONCU,TEVKIFATIADE */
    InvoiceType?: string;
    /** xs:base64Binary */
    InvoiceXml?: string;
    /** xs:boolean */
    IsArchived?: string;
    /** xs:boolean */
    IsFreeOfCharge?: string;
    /** xs:boolean */
    KismiIadeMi?: string;
    /** xs:dateTime */
    LastPaymentDate?: string;
    /** q2:ArrayOfstring */
    Notes?: string;
    /** xs:dateTime */
    OrderDate?: string;
    /** xs:string */
    OrderNumber?: string;
    /** Payment */
    Payment?: Payment;
    /** PublicReceiver */
    PublicReceiver?: PublicReceiver;
    /** Receiver */
    Receiver?: Receiver;
    /** ReceiverBranchAddress */
    ReceiverBranchAddress?: CompanyBranchAddress;
    /** xs:string */
    ReceiverInboxTag?: string;
    /** xs:string */
    ReceiverResponseDescription?: string;
    /** xs:string */
    RejectReason?: string;
    /** RepresentativeParty */
    RepresentativeParty?: RepresentativeParty;
    /** xs:dateTime */
    ReturnInvoiceDate?: string;
    /** xs:string */
    ReturnInvoiceETTN?: string;
    /** xs:string */
    ReturnInvoiceNumber?: string;
    /** xs:string */
    ReturnNote?: string;
    /** xs:string */
    ScacCode?: string;
    /** ScenarioType|xs:string|None,TEMELFATURA,TICARIFATURA,IHRACAT,YOLCUBERABERFATURA,HKS,KAMU */
    ScenarioType?: string;
    /** InvoiceStatus|xs:string|Onay_Bekliyor,Onaylandi,Reddedildi,Onay_Akisinda,Iade_Edildi,Gonderildi,Ziplendi,Gibe_Iletildi,Imza_Bekliyor,Gib_Tarafinda_Hata_Olustu,Sistem_Hatasi,Alici_Kabul_Etti,Alici_Reddetti,Alici_Iade_Etti,Otomatik_Onaylandi,Otomatik_Alici_Kabul_Etti,Uygulama_Yaniti_Yollaniyor,Uygulama_Yaniti_Hata_Aldi,Irsaliye_Yaniti_Yollaniyor,Irsaliye_Yaniti_Hata_Aldi */
    Status?: string;
    /** xs:string */
    SystemResponseDescription?: string;
    /** xs:string */
    TaxExemptionReason?: string;
    /** xs:decimal */
    TotalDiscountAmount?: string;
    /** xs:decimal */
    TotalLineExtensionAmount?: string;
    /** xs:decimal */
    TotalPayableAmount?: string;
    /** xs:decimal */
    TotalTaxInclusiveAmount?: string;
    /** xs:decimal */
    TotalVATAmount?: string;
    /** Tourist */
    Tourist?: Tourist;
    /** xs:base64Binary */
    XsltTemplate?: string;
}
