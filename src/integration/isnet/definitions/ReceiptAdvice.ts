import { AdditionalDocumentReferences } from "./AdditionalDocumentReferences";
import { Receiver } from "./Receiver";
import { InvoiceAttachments } from "./InvoiceAttachments";
import { ReceiptAdviceDetails } from "./ReceiptAdviceDetails";
import { Shipment2 } from "./Shipment2";

/**
 * ReceiptAdvice
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ReceiptAdvice {
    /** AdditionalDocumentReferences */
    AdditionalDocumentReferences?: AdditionalDocumentReferences;
    /** xs:dateTime */
    ArchiveDate?: string;
    /** BuyerCustomerParty */
    BuyerCustomerParty?: Receiver;
    /** xs:string */
    CompanyVendorNumber?: string;
    /** xs:decimal */
    CrossRate?: string;
    /** xs:dateTime */
    CrossRateDate?: string;
    /** xs:string */
    CurrencyCode?: string;
    /** DeliveryCustomerParty */
    DeliveryCustomerParty?: Receiver;
    /** DespatchSupplierParty */
    DespatchSupplierParty?: Receiver;
    /** InvoiceDetailStatus|xs:string|Zarflanmadi,Zarf_Kuyruga_Eklendi,Zarf_Isleniyor,Zip_Dosyasi_Degil,ZarfId_Uzunlugu_Gecersiz,Zarf_Arsivden_Kopyalanamadi,Zip_Acilamadi,Zip_Bir_Dosya_Icermeli,XML_Dosyasi_Degil,Zarf_ID_Ve_XML_Dosyasinin_Adi_Ayni_Olmali,Dokuman_Ayristirilamadi,Zarf_ID_Yok,Zarf_ID_VE_Zip_Dosyasi_Adi_Ayni_Olmali,Gecersiz_Versiyon,Schematron_Kontrol_Sonucu_Hatali,Xml_Sema_Kontrolundan_Gecemedi,Imza_Sahibi_TCKN_VKN_Alinamadi,Imza_Kaydedilemedi,Gonderilen_Zarf_Kayitli_bir_Fatura_Icermelidir,Gonderilen_Zarf_Kayitli_bir_Belge_Icermektedir,Yetki_Kontrol_Edilemedi,Gonderici_Birim_Yetkisi_Yok,Posta_Kutusu_Yetkisi_Yok,Islem_Yetkisi_Yok,Imza_Yetkisi_Kontrol_Edilemedi,Imza_Sahibi_Yetkisi,Gecersiz_Imza,Adres_Kontrol_Edilemedi,Adres_Bulunamadi,Kullanici_Eklenemedi,Kullanici_Silinemedi,Sistem_Yaniti_Hazirlanamadi,Sistem_Hatasi,Zarf_Basariyla_Islendi,Dokuman_Bulunan_Adrese_Gonderilemedi,Dokuman_Gonderimi_Basarisiz_Tekrar_Gonderme_Sonlandi,Hedeften_Sistem_Yaniti_Gelmedi,Hedeften_Sistem_Yaniti_Basarisiz_Geldi,Fatura_Iptale_Konu_Edildi,Basariyla_Tamamlandi */
    DetailStatus?: string;
    /** xs:string */
    ETTN?: string;
    /** xs:string */
    EnvelopeId?: string;
    /** xs:string */
    ExternalReceiptAdviceCode?: string;
    /** xs:boolean */
    IsArchived?: string;
    /** q45:ArrayOfstring */
    Notes?: string;
    /** xs:dateTime */
    OrderDate?: string;
    /** xs:string */
    OrderNumber?: string;
    /** ReceiptAdviceAttachments */
    ReceiptAdviceAttachments?: InvoiceAttachments;
    /** xs:dateTime */
    ReceiptAdviceCreationDate?: string;
    /** xs:dateTime */
    ReceiptAdviceDate?: string;
    /** ReceiptAdviceDetails */
    ReceiptAdviceDetails?: ReceiptAdviceDetails;
    /** xs:base64Binary */
    ReceiptAdviceHtml?: string;
    /** xs:string */
    ReceiptAdviceNumber?: string;
    /** xs:base64Binary */
    ReceiptAdvicePdf?: string;
    /** DespatchAdviceScenarioType|xs:string|TEMELIRSALIYE */
    ReceiptAdviceScenarioType?: string;
    /** ReceiptAdviceType|xs:string|SEVK */
    ReceiptAdviceType?: string;
    /** xs:base64Binary */
    ReceiptAdviceXml?: string;
    /** xs:string */
    ReceiverInboxTag?: string;
    /** xs:string */
    RelatedDespatchAdviceEttn?: string;
    /** SellerSupplierParty */
    SellerSupplierParty?: Receiver;
    /** Shipment */
    Shipment?: Shipment2;
    /** InvoiceStatus|xs:string|Onay_Bekliyor,Onaylandi,Reddedildi,Onay_Akisinda,Iade_Edildi,Gonderildi,Ziplendi,Gibe_Iletildi,Imza_Bekliyor,Gib_Tarafinda_Hata_Olustu,Sistem_Hatasi,Alici_Kabul_Etti,Alici_Reddetti,Alici_Iade_Etti,Otomatik_Onaylandi,Otomatik_Alici_Kabul_Etti,Uygulama_Yaniti_Yollaniyor,Uygulama_Yaniti_Hata_Aldi,Irsaliye_Yaniti_Yollaniyor,Irsaliye_Yaniti_Hata_Aldi */
    Status?: string;
    /** xs:string */
    SystemResponseDescription?: string;
    /** xs:base64Binary */
    XsltTemplate?: string;
}
