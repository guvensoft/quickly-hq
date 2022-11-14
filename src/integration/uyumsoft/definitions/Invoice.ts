import { UblExtensions } from "./UblExtensions";
import { UblVersionId } from "./UblVersionId";
import { CustomizationId } from "./CustomizationId";
import { ProfileId } from "./ProfileId";
import { Id } from "./Id";
import { Uuid } from "./Uuid";
import { InvoiceTypeCode } from "./InvoiceTypeCode";
import { DocumentCurrencyCode } from "./DocumentCurrencyCode";
import { TaxCurrencyCode } from "./TaxCurrencyCode";
import { PricingCurrencyCode } from "./PricingCurrencyCode";
import { PaymentCurrencyCode } from "./PaymentCurrencyCode";
import { PaymentAlternativeCurrencyCode } from "./PaymentAlternativeCurrencyCode";
import { InvoicePeriod } from "./InvoicePeriod";
import { OrderReference } from "./OrderReference";
import { BillingReference } from "./BillingReference";
import { DocumentReference } from "./DocumentReference";
import { Signature } from "./Signature";
import { AccountingSupplierParty } from "./AccountingSupplierParty";
import { AccountingCustomerParty } from "./AccountingCustomerParty";
import { IssuerParty } from "./IssuerParty";
import { Delivery } from "./Delivery";
import { PaymentMeans } from "./PaymentMeans";
import { PaymentTerms } from "./PaymentTerms";
import { AllowanceCharge } from "./AllowanceCharge";
import { TaxExchangeRate } from "./TaxExchangeRate";
import { TaxTotal } from "./TaxTotal";
import { LegalMonetaryTotal } from "./LegalMonetaryTotal";
import { InvoiceLine } from "./InvoiceLine";

/**
 * invoice
 * @targetNSAlias `q1`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:Invoice-2`
 */
export interface Invoice {
    /** UBLExtensions */
    UBLExtensions?: UblExtensions;
    /** UBLVersionID */
    UBLVersionID?: UblVersionId;
    /** CustomizationID */
    CustomizationID?: CustomizationId;
    /** ProfileID */
    ProfileID?: ProfileId;
    /** ID */
    ID?: Id;
    /** xs:boolean */
    CopyIndicator?: string;
    /** UUID */
    UUID?: Uuid;
    /** xs:date */
    IssueDate?: string;
    /** xs:time */
    IssueTime?: string;
    /** InvoiceTypeCode */
    InvoiceTypeCode?: InvoiceTypeCode;
    /** xs:string */
    Note?: string;
    /** DocumentCurrencyCode */
    DocumentCurrencyCode?: DocumentCurrencyCode;
    /** TaxCurrencyCode */
    TaxCurrencyCode?: TaxCurrencyCode;
    /** PricingCurrencyCode */
    PricingCurrencyCode?: PricingCurrencyCode;
    /** PaymentCurrencyCode */
    PaymentCurrencyCode?: PaymentCurrencyCode;
    /** PaymentAlternativeCurrencyCode */
    PaymentAlternativeCurrencyCode?: PaymentAlternativeCurrencyCode;
    /** xs:string */
    AccountingCost?: string;
    /** xs:decimal */
    LineCountNumeric?: string;
    /** InvoicePeriod */
    InvoicePeriod?: InvoicePeriod;
    /** OrderReference */
    OrderReference?: OrderReference;
    /** BillingReference */
    BillingReference?: BillingReference;
    /** DespatchDocumentReference */
    DespatchDocumentReference?: DocumentReference;
    /** ReceiptDocumentReference */
    ReceiptDocumentReference?: DocumentReference;
    /** OriginatorDocumentReference */
    OriginatorDocumentReference?: DocumentReference;
    /** ContractDocumentReference */
    ContractDocumentReference?: DocumentReference;
    /** AdditionalDocumentReference */
    AdditionalDocumentReference?: DocumentReference;
    /** Signature */
    Signature?: Signature;
    /** AccountingSupplierParty */
    AccountingSupplierParty?: AccountingSupplierParty;
    /** AccountingCustomerParty */
    AccountingCustomerParty?: AccountingCustomerParty;
    /** BuyerCustomerParty */
    BuyerCustomerParty?: AccountingCustomerParty;
    /** SellerSupplierParty */
    SellerSupplierParty?: AccountingSupplierParty;
    /** TaxRepresentativeParty */
    TaxRepresentativeParty?: IssuerParty;
    /** Delivery */
    Delivery?: Delivery;
    /** PaymentMeans */
    PaymentMeans?: PaymentMeans;
    /** PaymentTerms */
    PaymentTerms?: PaymentTerms;
    /** AllowanceCharge */
    AllowanceCharge?: AllowanceCharge;
    /** TaxExchangeRate */
    TaxExchangeRate?: TaxExchangeRate;
    /** PricingExchangeRate */
    PricingExchangeRate?: TaxExchangeRate;
    /** PaymentExchangeRate */
    PaymentExchangeRate?: TaxExchangeRate;
    /** PaymentAlternativeExchangeRate */
    PaymentAlternativeExchangeRate?: TaxExchangeRate;
    /** TaxTotal */
    TaxTotal?: TaxTotal;
    /** WithholdingTaxTotal */
    WithholdingTaxTotal?: TaxTotal;
    /** LegalMonetaryTotal */
    LegalMonetaryTotal?: LegalMonetaryTotal;
    /** InvoiceLine */
    InvoiceLine?: InvoiceLine;
}
