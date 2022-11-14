import { InvoiceServiceBasicHttpEndpoint } from "../ports/InvoiceServiceBasicHttpEndpoint";

export interface InvoiceService {
    readonly InvoiceServiceBasicHttpEndpoint: InvoiceServiceBasicHttpEndpoint;
}
