import { UBL } from "../../models/external/ubl";
import { CompanyType, CompanyStatus, Company } from "../../models/management/company";
import { InvoiceStatus, InvoiceType, Invoice, InvoiceItem } from "../../models/management/invoice";
import { readFile } from "fs";
import { OptionsV2, Parser, processors } from "xml2js";
import { parseNumbers, parseBooleans } from "xml2js/lib/processors";
import { readDirectory } from "../shared/files";
import path from 'path'

export const invoiceImporter = (store_id: string, invoice_id?: string) => {
    const parserOpts: OptionsV2 = { ignoreAttrs: true, explicitArray: false, tagNameProcessors: [processors.stripPrefix], valueProcessors: [parseNumbers, parseBooleans] };
    const xmlParser = new Parser(parserOpts);
    readDirectory(path.join(__dirname, '../', '/backup/' + store_id + '/invoices/')).then(invoices => {
        invoices.forEach(invoice => {
            const invoicePath = path.join(__dirname, '../', '/backup/' + store_id + '/invoices/' + invoice);
            readFile(invoicePath, (err, buffer) => {
                if (!err) {
                    let data = buffer.toString('utf8');
                    xmlParser.parseStringPromise(data).then((ubl: UBL) => {

                        let Invoice = invoiceConverter(ubl, store_id);

                        // StoresDB.Invoices.post(Invoice).then(isOk => {
                        //     console.log(isOk);
                        // }).catch(err => {
                        //     console.log(err);
                        // })

                    }).catch(err => {
                        console.log('XML Parse Error: ', err);
                    })
                } else {
                    console.log('File Read Error: ', err);
                }
            });
        })
    }).catch(err => {
        console.log('Read Directory Error: ', err);
    });
}

export const invoiceConverter = (ubl: UBL, store_id?: string) => {
    const UBL = ubl.Invoice;

    let fromCompany: Company = {
        name: UBL.AccountingSupplierParty.Party.PartyName.Name,
        tax_no: (UBL.AccountingSupplierParty.Party.PartyIdentification.ID || UBL.AccountingSupplierParty.Party.PartyIdentification[0].ID),
        tax_administration: UBL.AccountingSupplierParty.Party.PartyTaxScheme.TaxScheme.Name,
        address: {
            country: UBL.AccountingSupplierParty.Party.PostalAddress.Country.Name,
            state: UBL.AccountingSupplierParty.Party.PostalAddress.District,
            province: UBL.AccountingSupplierParty.Party.PostalAddress.CityName,
            district: UBL.AccountingSupplierParty.Party.PostalAddress.CitySubdivisionName,
            street: UBL.AccountingSupplierParty.Party.PostalAddress.StreetName,
            description: (UBL.AccountingSupplierParty.Party.PostalAddress.StreetName + ' ' + UBL.AccountingSupplierParty.Party.PostalAddress.PostalZone + ', ' + UBL.AccountingSupplierParty.Party.PostalAddress.CitySubdivisionName + '/' + UBL.AccountingSupplierParty.Party.PostalAddress.CityName + ', ' + UBL.AccountingSupplierParty.Party.PostalAddress.Country.Name).replace('undefined', '').replace('undefined', ' ').replace('undefined', ' '),
            cordinates: null
        },
        email: UBL.AccountingSupplierParty.Party.Contact?.ElectronicMail,
        phone_number: UBL.AccountingSupplierParty.Party.Contact?.Telephone,
        type: CompanyType.ANONYMOUS,
        status: CompanyStatus.ACTIVE,
        supervisor: null,
        timestamp: Date.now(),
        website: UBL.AccountingSupplierParty.Party?.WebsiteURI,
    }
    let toCompany: Company = {
        name: UBL.AccountingCustomerParty.Party.PartyName.Name,
        tax_no: (UBL.AccountingCustomerParty.Party.PartyIdentification.ID || UBL.AccountingCustomerParty.Party.PartyIdentification[0].ID),
        tax_administration: UBL.AccountingCustomerParty.Party?.PartyTaxScheme?.TaxScheme.Name,
        address: {
            country: UBL.AccountingCustomerParty.Party.PostalAddress.Country.Name,
            state: UBL.AccountingCustomerParty.Party.PostalAddress.District,
            province: UBL.AccountingCustomerParty.Party.PostalAddress.CityName,
            district: UBL.AccountingCustomerParty.Party.PostalAddress.CitySubdivisionName,
            street: UBL.AccountingCustomerParty.Party.PostalAddress.StreetName,
            description: (UBL.AccountingCustomerParty.Party.PostalAddress.StreetName + ' ' + UBL.AccountingCustomerParty.Party.PostalAddress.PostalZone + ', ' + UBL.AccountingCustomerParty.Party.PostalAddress.CitySubdivisionName + '/' + UBL.AccountingCustomerParty.Party.PostalAddress.CityName + ', ' + UBL.AccountingCustomerParty.Party.PostalAddress.Country.Name).replace('undefined', '').replace('undefined', ' ').replace('undefined', ' ').trim(),
            cordinates: null
        },
        email: UBL.AccountingCustomerParty.Party.Contact?.ElectronicMail,
        phone_number: UBL.AccountingCustomerParty.Party.Contact?.Telephone,
        type: CompanyType.ANONYMOUS,
        status: CompanyStatus.ACTIVE,
        supervisor: null,
        timestamp: Date.now(),
        website: UBL.AccountingCustomerParty.Party?.WebsiteURI,
    }
    let Invoice: Invoice = {
        store: store_id,
        from: fromCompany,
        to: toCompany,
        items: [],
        total: UBL.LegalMonetaryTotal.PayableAmount,
        sub_total: UBL.LegalMonetaryTotal.TaxExclusiveAmount,
        tax_total: UBL.TaxTotal.TaxAmount,
        discount_total: (UBL?.AllowanceCharge?.Amount | 0),
        installment: 1,
        currency_rates: [],
        status: InvoiceStatus.WAITING,
        type: InvoiceType.SELLING,
        timestamp: new Date(UBL.IssueDate + ' ' + UBL.IssueTime).getTime(),
        expiry: new Date(UBL.IssueDate + ' ' + UBL.IssueTime).getTime() + 60 * 60 * 1000,
        ettn: UBL.UUID,
        inid: UBL.ID,
        notes: UBL.Note.toString()
    }

    if (Array.isArray(UBL.InvoiceLine)) {

        UBL.InvoiceLine.map(obj => {
            let InvoiceItem: InvoiceItem = {
                name: obj.Item.Name,
                description: obj.Item?.Note,
                sku: obj.Item?.SellersItemIdentification?.ID,
                price: obj.Price.PriceAmount,
                quantity: obj.InvoicedQuantity,
                tax_value: obj.TaxTotal?.TaxSubtotal?.Percent,
                discount: (obj?.AllowanceCharge?.Amount | 0),
                currency: 'TRY',
                total_tax: obj.TaxTotal?.TaxAmount,
                total_price: obj.LineExtensionAmount
            }
            Invoice.items.push(InvoiceItem)
        })
    } else {
        let obj: any = UBL.InvoiceLine;

        let InvoiceItem: InvoiceItem = {
            name: obj.Item.Name,
            description: obj.Item?.Note,
            sku: obj.Item?.SellersItemIdentification?.ID,
            price: obj.Price.PriceAmount,
            quantity: obj.InvoicedQuantity,
            tax_value: obj.TaxTotal?.TaxSubtotal?.Percent,
            discount: (obj?.AllowanceCharge?.Amount | 0),
            currency: 'TRY',
            total_tax: obj.TaxTotal?.TaxAmount,
            total_price: obj.LineExtensionAmount
        }
        Invoice.items.push(InvoiceItem)
    }

    return Invoice;
}