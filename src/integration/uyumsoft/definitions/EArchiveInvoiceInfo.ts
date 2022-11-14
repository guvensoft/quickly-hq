import { NewGenerationPamentRecorderInfo } from "./NewGenerationPamentRecorderInfo";
import { InternetSalesInfo } from "./InternetSalesInfo";
import { WithHoldings } from "./WithHoldings";

/**
 * EArchiveInvoiceInfo
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface EArchiveInvoiceInfo {
    /** NewGenerationPamentRecorderInfo */
    NewGenerationPamentRecorderInfo?: NewGenerationPamentRecorderInfo;
    /** InternetSalesInfo */
    InternetSalesInfo?: InternetSalesInfo;
    /** WithHoldings[] */
    WithHoldings?: Array<WithHoldings>;
}
