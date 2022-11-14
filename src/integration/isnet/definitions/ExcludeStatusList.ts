
/**
 * ExcludeStatusList
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface ExcludeStatusList {
    /** InvoiceStatus|xs:string|Onay_Bekliyor,Onaylandi,Reddedildi,Onay_Akisinda,Iade_Edildi,Gonderildi,Ziplendi,Gibe_Iletildi,Imza_Bekliyor,Gib_Tarafinda_Hata_Olustu,Sistem_Hatasi,Alici_Kabul_Etti,Alici_Reddetti,Alici_Iade_Etti,Otomatik_Onaylandi,Otomatik_Alici_Kabul_Etti,Uygulama_Yaniti_Yollaniyor,Uygulama_Yaniti_Hata_Aldi,Irsaliye_Yaniti_Yollaniyor,Irsaliye_Yaniti_Hata_Aldi */
    InvoiceStatus?: Array<string>;
}
