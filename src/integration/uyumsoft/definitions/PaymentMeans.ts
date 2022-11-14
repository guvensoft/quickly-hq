import { PaymentMeansCode } from "./PaymentMeansCode";
import { PaymentChannelCode } from "./PaymentChannelCode";
import { FinancialAccount } from "./FinancialAccount";

/**
 * PaymentMeans
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface PaymentMeans {
    /** PaymentMeansCode */
    PaymentMeansCode?: PaymentMeansCode;
    /** xs:date */
    PaymentDueDate?: string;
    /** PaymentChannelCode */
    PaymentChannelCode?: PaymentChannelCode;
    /** xs:string */
    InstructionNote?: string;
    /** PayerFinancialAccount */
    PayerFinancialAccount?: FinancialAccount;
    /** PayeeFinancialAccount */
    PayeeFinancialAccount?: FinancialAccount;
}
