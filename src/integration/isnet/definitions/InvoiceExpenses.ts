import { InvoiceExpense } from "./InvoiceExpense";

/**
 * InvoiceExpenses
 * @targetNSAlias `tns`
 * @targetNamespace `http://schemas.datacontract.org/2004/07/EInvoice.Service.Model`
 */
export interface InvoiceExpenses {
    /** InvoiceExpense[] */
    InvoiceExpense?: Array<InvoiceExpense>;
}
