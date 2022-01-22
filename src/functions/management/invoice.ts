import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import { Invoice, InvoiceType, InvoiceStatus, InvoiceItem, Currency } from '../../models/management/invoice';
import { Logo, NormalFont, BoldFont } from '../../utils/blobs';
import { Company, CompanyStatus, CompanyType } from '../../models/management/company';
// import XLSX from 'xlsx';

const QuicklyCompany: Company = {
    name: "Quickly Yazılım Kurumsal Hizmetler A.Ş.",
    email: "info@quickly.com.tr",
    phone_number: "5310856881",
    website: "https://quickly.com.tr",
    tax_administration: "Beşiktaş",
    tax_no: "6320729003",
    supervisor: {
      username: "63208717",
      password: "454043"
    },
    type: CompanyType.ANONYMOUS,
    status: CompanyStatus.ACTIVE,
    address: {
      country: "90",
      state: "34",
      province: "1183",
      district: "40214",
      street: "SÜLEYMAN SEBA",
      description: "Vişnezade, Süleyman Seba Cd. No:85/1, Beşiktaş/İstanbul, Türkiye",
      cordinates: {
        latitude: 41.0426163,
        longitude: 28.9996227
      }
    },
    timestamp: 1639501500939,
    _id: "77340a60-11d3-4c7f-97e5-6ddc058ec3a5",
    _rev: "1-76da240bdc01db5022b3611c55dd93c6"
  }

const InvoiceCompany: Company = {
    name: 'DorockXL Gıda İşletmeleri Etkinlik Organizasyon A.Ş',
    address: {
        country: "90",
        state: "34",
        province: "1183",
        district: "40214",
        street: "SÜLEYMAN SEBA",
        description: "Vişnezade, Süleyman Seba Cd. No:85/1, Beşiktaş/İstanbul, Türkiye",
        cordinates: {
          latitude: 41.0426163,
          longitude: 28.9996227
        }
      },
    phone_number: '05321675440',
    email: 'kurumsal@dorockxl.com',
    website: 'www.dorockxl.com',
    tax_no: '458 658 99 66',
    tax_administration: 'Beyoğlu',
    supervisor: null,
    type: CompanyType.ANONYMOUS,
    status: CompanyStatus.ACTIVE,
    timestamp: Date.now()
}

const invoice: Invoice = {
    from: QuicklyCompany,
    to: InvoiceCompany,
    items: [
        {
            name: 'Okpos Optimus',
            description: 'Satış Noktası Terminali',
            currency: 'USD',
            price: 450,
            quantity: 2,
            discount: 0,
            tax_value: 18,
            total_tax: 0,
            total_price: 0
        },
        { name: 'Jolimark TP-850', description: 'Thermal Yazıcı', price: 100, currency: 'USD', discount: 0, quantity: 2, tax_value: 18, total_tax: 0, total_price: 0 },
        // { name: 'Qr Dijital Menü Hizmeti', description: 'Yıllık Ücret', price: 1000, currency: 'TRY', discount: 0, quantity: 1, tax_value: 18, total_tax: 0, total_price: 0 }
    ],
    total: 0,
    sub_total: 0,
    tax_total: 0,
    installment: 4,
    currency_rates: [],
    status: InvoiceStatus.WAITING,
    type: InvoiceType.OPEN,
    timestamp: 163716152000,
    expiry: 1639753520000
}

const ProformaHead = "PROFORMA FATURA";

const headCompanyName = QuicklyCompany.name
const headCompanyTax = `${QuicklyCompany.tax_administration} Vergi Dairesi - Vergi No: ${QuicklyCompany.tax_no}`;
const headCompanyAddress = QuicklyCompany.address.description;
const headCompanySocial = `${QuicklyCompany.website} - ${QuicklyCompany.email} - ${QuicklyCompany.phone_number}`;

let customerName = invoice.to.name;
let customerAddress = invoice.to.address.description;
let cutomerCompanyTax = `${invoice.to.tax_administration} Vergi Dairesi - Vergi No: ${invoice.to.tax_no}`;
let customerCompanySocial = `${invoice.to.website} - ${invoice.to.email} - ${invoice.to.phone_number}`;

let selectedCurrency;

// jsPDF Instance
const PDF = new jsPDF('portrait', 'pt');
// Quickly Font
PDF.addFileToVFS("Normal.ttf", NormalFont);
PDF.addFont("Normal.ttf", "Normal", "normal");
const normalFont = "Normal";
// Quickly Bold Font 
PDF.addFileToVFS("Bold.ttf", BoldFont);
PDF.addFont("Bold.ttf", "Bold", "bold");
const boldFont = "Bold"
PDF.setFont("Normal");


// Form data array of objects with installment plan and invoice status/type
let objectArrayData = [
    {
        "name": "elma",
        "amount": "5",
        "unitPrice": "5",
        "taxAddedValue": "18",
        "note": "notenotenote",
        "currency": "$",
        "installment": 4,
        "invoiceType": "Açık",
        "invoceStatus": "Aktif"
    },
    {
        "name": "elma",
        "amount": "5",
        "unitPrice": "5",
        "taxAddedValue": "18",
        "note": "notenotenote",
        "currency": "₺",
        "installment": 4,
        "invoiceType": "Açık",
        "invoceStatus": "Aktif"
    },
    {
        "name": "elma",
        "amount": "5",
        "unitPrice": "5",
        "taxAddedValue": "18",
        "note": "notenotenote",
        "currency": "₺",
        "installment": 4,
        "invoiceType": "Açık",
        "invoceStatus": "Aktif"
    },
    {
        "name": "elma",
        "amount": "5",
        "unitPrice": "5",
        "taxAddedValue": "18",
        "note": "notenotenote",
        "currency": "₺",
        "installment": 4,
        "invoiceType": "Açık",
        "invoceStatus": "Aktif"
    },
    {
        "name": "elma",
        "amount": "5",
        "unitPrice": "5",
        "taxAddedValue": "18",
        "note": "notenotenote",
        "currency": "₺",
        "installment": 4,
        "invoiceType": "Açık",
        "invoceStatus": "Aktif"
    }
]

// Table title and background color
let tableColor = '#D9534F';

// Invoice data 
let invoiceColumns = ["#", "Ürün/Hizmet", "Adet", "KDV", "Birim Fiyat", "Toplam Fiyat "];
// Processed invoice data
let invoiceData = [];

// Invoice total data - no columns
let productTotalColumn = ["Ürün/Hizmet Toplam                 :"];
let taxRateColumn = ["KDV(%18)                                   :"];
let totalColumn = ["Genel Toplam                           :"];
let productTotalRow = [];
let taxRateRow = [];
let totalRow = [];
let productTotal = 0; // product/service total
let overallTotal = 0; // overall total 
let totalTax = 0; // total tax 
let tableSpace = "           "; // Invoice total table row space

// Table final y values
let invoiceTotalFinalY = 0;
let installmentTitleFinalY = 0;
let installmentTableFinalY = 0;
let supportTitleFinalY = 0;
let supportTableFinalY = 0;

// Installment plan data 
// let installmentColumns = ["#", "Ürün/Hizmet", "Taksit Adedi", "Taksit Tutarı"];
// let installmentData = [];
// let installmentTitleColumn = ["Taksitli Ödeme Planı"];
// let installmentTitleRow = [];

// Software and support cost data
// let supportTitleColumn = ["Yazılım ve Destek Bedeli"];
// let supportTitleRow = [];
// let supportColumns = ["#", "Ürün/Hizmet", "Adet", "Birim Fiyat", "Toplam Tutarı"];

let subscriptionDuration = 12;
let unitPrice = 250;
let supportRows = [1, "Yazılım ve Destek Bedeli (KDV Dahil)", subscriptionDuration, unitPrice + ' TL', subscriptionDuration * unitPrice + ' TL'];

//// Date Constants!

const date = new Date();
const month = [date.getMonth()];
const day = String(date.getDate()).padStart(2, '0');
const dayLong = new Date().toLocaleString('tr-TR', { weekday: 'long' });
const year = date.getFullYear();
const hour = date.getHours().toString();
const minute = date.getMinutes().toString();

function calculateTotal() {
    invoiceData.forEach(element => {
        let price = parseInt(element[5]);
        let tax = parseInt(element[5]);
        totalTax += (tax * 18) / 100;
        overallTotal += price;
    });
    productTotal = overallTotal - totalTax;
}
// Get currency request 
function getCurrency(currency:Currency) {
    return axios.get('https://api.genelpara.com/embed/doviz.json').then(res => {
        res.data[currency].satis = res.data[currency].satis.replace("<a href=https://www.genelpara.com/doviz/dolar/ style=display:none;>Dolar kaç tl</a>", "");
        selectedCurrency = res.data[currency].satis;
        return selectedCurrency;
    })
}

const addProformBody = (curr) => {
    // Logo
    PDF.addImage(Logo, 'PNG', 20, 20, 100, 50);
    // Head company name 
    PDF.setFontSize(9);
    PDF.setTextColor(0, 0, 255);
    PDF.text(headCompanyName, 215, 25);
    PDF.setFontSize(8);
    PDF.setTextColor(0, 0, 0);
    // Head company tax 
    PDF.text(headCompanyTax, 215, 35);
    // Head company address
    PDF.text(headCompanyAddress, 215, 45);
    // Head company social
    PDF.text(headCompanySocial, 215, 55);
    // Body proforma text
    PDF.setFontSize(17);
    PDF.text(ProformaHead, 175, 130);



    // Date
    PDF.setTextColor(0, 0, 255);
    PDF.setFontSize(10);
    PDF.text(day + '/' + month + '/' + year + ' ' + dayLong, 355, 200);
    // Currency and time
    PDF.text("Dolar: " + parseFloat(curr).toFixed(2) + " TRY", 356, 215);
    PDF.setTextColor(0, 0, 255);
    PDF.setFontSize(9);
    PDF.text(hour + ":" + minute + " UTC", 440, 215);
}

const addCustomerCompany = () => {
    // Customer name
    PDF.setFontSize(9);
    PDF.setTextColor(0, 0, 255);
    PDF.text(customerName, 20, 200);
    // Customer Tax
    PDF.setTextColor(0, 0, 0);
    PDF.setFontSize(8);
    PDF.text(PDF.splitTextToSize(cutomerCompanyTax, 300), 20, 212);
    // Customer Contact
    PDF.setFontSize(8);
    PDF.text(PDF.splitTextToSize(customerCompanySocial, 300), 20, 222);
    // Customer adddress
    PDF.setFontSize(8);
    PDF.text(PDF.splitTextToSize(customerAddress, 300), 20, 232);
}

const addInvoiceTable = () => {
    // Invoice table
    autoTable(PDF, {
        margin: { right: 0, left: 20 },
        tableWidth: 1,
        startY: 250,
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: tableColor,
            lineWidth: 1,
            lineColor: [0, 0, 0],
            halign: 'center',
        },
        bodyStyles: {
            halign: 'center',
            lineWidth: 1,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        },
        head: [invoiceColumns],
        body: invoice.items.map((item, index) => {
            return [index + 1, item.name + '\n' + item.description,  item.quantity, '% ' +  item.tax_value, item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + currencyTransformer(item.currency), priceCalculator(item) ]
        }),
        // [
        //     [1, 'sdf', 2, 4, 5, 6],
        //     [1, 'sdf', 2, 4, 5, 6],
        //     [1, 'sdf', 2, 4, 5, 6],
        //     [1, 'sdf', 2, 4, 5, 6],
        //     [1, 'sdf', 2, 4, 5, 6]
        // ],
        tableLineWidth: 0,
        tableLineColor: [0, 0, 0],
        theme: 'grid',
        styles: {
            fontSize: 8,
            font: normalFont,
            valign: 'middle',
        },
        columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 240, halign: 'left' }, 2: { cellWidth: 35 }, 3: { cellWidth: 35 }, 4: { cellWidth: 60 }, 5: { cellWidth: 80 } }
    });
}

const priceCalculator = (item:InvoiceItem) => {
    if(item.currency !== 'TRY'){
        return (item.price * item.quantity * selectedCurrency).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL';
    }else{
        return (item.price * item.quantity).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'
    }
}

const currencyTransformer = (key: string) => {
    switch (key) {
        case 'USD':
            return ' $'
        case 'EUR':
            return ' €'
        case 'TRY':
            return ' TL'
        default:
            return ' TL'
    }
}

const addInvoiceTotalTable = () => {
    let offsetY = 0;

    if (getInvoiceDataLength(invoiceData) < 5) {
        offsetY = ((getInvoiceDataLength(invoiceData) + 1) * 19) + ((getNumNotes()) / 2 * 17);
    } else {
        offsetY = ((getInvoiceDataLength(invoiceData) + 1) * 19) + ((getNumNotes()) / 2 * 18);
    }
    // Y table offset
    // let offsetY = ((getInvoiceDataLength(invoiceData) + 1) * 19) + ((getNumNotes()) / 2 * 18);

    // Invoice total table
    productTotalColumn[0] = `${productTotalColumn[0].concat(tableSpace) + productTotal.toFixed(2) + ' TL'}`;
    autoTable(PDF, {
        tableWidth: 200,
        // startX: 700,
        startY: 308 + offsetY,
        pageBreak: 'avoid',
        headStyles: {
            fillColor: tableColor,
            textColor: [255, 255, 255],
            halign: 'left',
            lineWidth: 1,
            lineColor: [0, 0, 0],
        },
        head: [productTotalColumn],
        body: [productTotalRow],
        margin: { left: 295 },
        theme: 'grid',
        styles: {
            fontSize: 8,
            font: boldFont,
        },
        columnStyles: { 0: { cellWidth: 155 } }
    });

    // Tax table
    taxRateColumn[0] = `${taxRateColumn[0].concat(tableSpace) + totalTax.toFixed(2) + ' TL'}`;
    autoTable(PDF, {
        tableWidth: 190,
        // startX: 700,
        startY: 328 + offsetY,
        pageBreak: 'avoid',
        headStyles: {
            fillColor: tableColor,
            textColor: [255, 255, 255],
            halign: 'left',
            lineWidth: 1,
            lineColor: [0, 0, 0],
        },
        head: [taxRateColumn],
        body: [taxRateRow],
        margin: { left: 295 },
        theme: 'grid',
        styles: {
            fontSize: 8,
            font: boldFont,
        },
        columnStyles: { 0: { cellWidth: 155 } }
    });

    //  Total table
    totalColumn[0] = `${totalColumn[0].concat(tableSpace) + overallTotal.toFixed(2) + ' TL'}`;
    autoTable(PDF, {
        tableWidth: 190,
        // startX: 700,
        startY: 348 + offsetY,
        pageBreak: 'avoid',
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: tableColor,
            halign: 'left',
            lineWidth: 1,
            lineColor: [0, 0, 0],
        },
        head: [totalColumn],
        body: [totalRow],
        bodyStyles: {
            textColor: [0, 0, 0]
        },
        margin: { left: 295 },
        theme: 'grid',
        styles: {
            fontSize: 8,
            font: boldFont,
        },
        columnStyles: { 0: { cellWidth: 155 } },
        didDrawCell: (data) => {
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const element = data["row"];
                    invoiceTotalFinalY = element.cells[0].y + element.height;
                }
            }
        }
    });
}

// const addInstallmentTables = () => {
//     // Installment title table
//     let installmentTitleOffset = 30;
//     autoTable(PDF, {
//         margin: { right: 0, left: 20 },
//         tableWidth: 465,
//         startX: 700,
//         startY: invoiceTotalFinalY + installmentTitleOffset,
//         pageBreak: 'avoid',
//         headStyles: {
//             textColor: [255, 255, 255],
//             halign: 'center',
//             lineWidth: 1,
//             lineColor: [0, 0, 0],
//             fillColor: tableColor
//         },
//         head: [installmentTitleColumn],
//         body: [installmentTitleRow],
//         styles: {
//             fontSize: 8,
//             font: boldFont,
//         },
//         columnStyles: { 0: { cellWidth: 155 } },
//         didDrawCell: (data) => {
//             for (const key in data) {
//                 if (Object.hasOwnProperty.call(data, key)) {
//                     const element = data["row"];
//                     installmentTitleFinalY = element.cells[0].y + element.height;
//                 }
//             }
//         }
//     });

//     // Installment table
//     autoTable(PDF, {
//         margin: { right: 0, left: 20 },
//         tableWidth: 190,
//         startX: 0,
//         startY: installmentTitleFinalY,
//         pageBreak: 'avoid',
//         headStyles: {
//             fillColor: [255, 255, 255],
//             textColor: tableColor,
//             halign: 'center',
//             lineWidth: 1,
//             lineColor: [0, 0, 0],
//         },
//         bodyStyles: {
//             halign: 'center',
//             valign: 'middle',
//             lineWidth: 1,
//             lineColor: [0, 0, 0],
//             textColor: [0, 0, 0]
//         },
//         head: [installmentColumns],
//         body: [installmentData],
//         tableLineWidth: 1,
//         tableLineColor: [0, 0, 0],
//         theme: 'grid',
//         styles: {
//             fontSize: 8,
//             font: normalFont,
//         },
//         columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 250, halign: 'left' }, 2: { cellWidth: 70 }, 3: { cellWidth: 120 } },
//         didDrawCell: (data) => {
//             for (const key in data) {
//                 if (Object.hasOwnProperty.call(data, key)) {
//                     const element = data["row"];
//                     installmentTableFinalY = element.cells[0].y + element.height;
//                 }
//             }
//         },
//     });
// }

// const addSupportTables = () => {
//     let supportTitleOffset = 30;
//     // Support title table
//     autoTable(PDF, {
//         margin: { right: 0, left: 20 },
//         tableWidth: 465,
//         startX: 700,
//         startY: installmentTableFinalY + supportTitleOffset,
//         pageBreak: 'avoid',
//         headStyles: {
//             fillColor: tableColor,
//             textColor: [255, 255, 255],
//             halign: 'center',
//             lineWidth: 1,
//             lineColor: [0, 0, 0],
//         },
//         head: [supportTitleColumn],
//         body: [supportTitleRow],
//         styles: {
//             fontSize: 8,
//             font: boldFont,
//         },
//         columnStyles: { 0: { cellWidth: 155 } },
//         didDrawCell: (data) => {
//             for (const key in data) {
//                 if (Object.hasOwnProperty.call(data, key)) {
//                     const element = data["row"];
//                     supportTitleFinalY = element.cells[0].y + element.height;
//                 }
//             }
//         }
//     });

//     // Support table
//     autoTable(PDF, {
//         margin: { right: 0, left: 20 },
//         startX: 0,
//         startY: supportTitleFinalY,
//         pageBreak: 'avoid',
//         headStyles: {
//             fillColor: [255, 255, 255],
//             textColor: tableColor,
//             halign: 'center',
//             lineWidth: 1,
//             lineColor: [0, 0, 0],
//         },
//         bodyStyles: {
//             halign: 'center',
//             lineWidth: 1,
//             lineColor: [0, 0, 0],
//             textColor: [0, 0, 0]
//         },
//         head: [supportColumns],
//         body: [supportRows],
//         theme: 'grid',
//         styles: {
//             fontSize: 8,
//             font: normalFont,
//             valign: 'middle',
//         },
//         columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 250, halign: 'left' }, 2: { cellWidth: 35 }, 3: { cellWidth: 35 }, 4: { cellWidth: 120 } },
//     });
// }


// Add sidebar

const addSidebar = () => {
    // Right bar blue line
    PDF.setFillColor('#2B3E50');
    PDF.setDrawColor('#2B3E50');
    PDF.rect(520, 0, 75, 845, 'FD');
    /// Right bar logo text 
    PDF.setFontSize(10);
    PDF.setTextColor(255, 255, 255);
    PDF.text(headCompanyName + '    ' + headCompanyTax, 540, 770, null, 90);
    // PDF.text(, 540, 480, null, 90);
    PDF.text(headCompanyAddress, 560, 770, null, 90);
    PDF.text(headCompanySocial, 580, 770, null, 90);
}
// Add footer
const addFooter = () => {
    // Head company name 
    PDF.setFontSize(9);
    PDF.setTextColor(0, 0, 0);
    // PDF.text(headCompanyName, 215, 750, { align: 'center' });
    PDF.text(headCompanyName, 200, 750);
    PDF.setFontSize(8);
    PDF.setTextColor(0, 0, 0);
    // Head company tax 
    PDF.text(headCompanyTax, 200, 760);
    // Head company address
    PDF.text(headCompanyAddress, 200, 770);
    // Head company social
    PDF.text(headCompanySocial, 200, 780);
}

// Change objectArrayData list of objects to 2 dimensional array in order to feed invoice table rows 
const toInvoiceObjectArray = () => {
    invoiceData = objectArrayData.map((item, index) => {
        if (item.note) {
            if (item.currency == '$') {
                return [
                    index + 1,
                    item.name + "\n" + "Not: " + item.note,
                    "%" + item.taxAddedValue,
                    item.amount,
                    item.unitPrice + ' $',
                    (parseInt(item.amount) * (parseInt(item.unitPrice)) * selectedCurrency).toFixed(2) + ' TL',
                    item.installment
                ]
            } else {
                return [
                    index + 1,
                    item.name + "\n" + "Not: " + item.note,
                    "%" + item.taxAddedValue,
                    item.amount,
                    item.unitPrice + ' TL',
                    (parseInt(item.amount) * parseInt(item.unitPrice)) + ' TL',
                    item.installment
                ]
            }
        } else {
            if (item.currency == '$') {
                return [
                    index + 1,
                    item.name,
                    "%" + item.taxAddedValue,
                    item.amount,
                    item.unitPrice + ' $',
                    (parseInt(item.amount) * (parseInt(item.unitPrice)) * selectedCurrency).toFixed(2) + ' TL',
                    item.installment
                ]
            } else {
                return [
                    index + 1,
                    item.name,
                    "%" + item.taxAddedValue,
                    item.amount,
                    item.unitPrice + ' TL',
                    (parseInt(item.amount) * parseInt(item.unitPrice)) + ' TL',
                    item.installment
                ]
            }
        }
    })
}

// const toInstallmentObjectArray = () => {
//     let installmentNumber = objectArrayData[objectArrayData.length - 1].installment;
//     let installmentPrice = 0;
//     invoiceData.forEach(element => {
//         let price = parseInt(element[5]);
//         let amount = parseInt(element[3])
//         installmentPrice += price;
//     });
//     installmentPrice = installmentPrice / installmentNumber;
//     installmentData = [["1", "Donanımlar (KDV Dahil)", installmentNumber, installmentPrice]];
// }

// Get the number of elements to specify invoice total table position 
function getInvoiceDataLength(invoiceData) {
    return invoiceData.length;
}

// If any, get the number of note attributes to specify invoice total table position 
function getNumNotes() {
    let count = 0;
    objectArrayData.forEach(element => {
        if (element.note) count += 1;
    });
    return count;
}

function mainFunction() {
    getCurrency('USD').then(curr => {
        console.log(curr);
        // toInvoiceObjectArray();
        // toInstallmentObjectArray();
        // calculateTotal();
        addProformBody(curr);
        addSidebar();
        addCustomerCompany();
        addInvoiceTable();
        // addInvoiceTotalTable();
        // addInstallmentTables();
        // addSupportTables();
        // addFooter();
        PDF.save('invoice.pdf');
    });
}

export const proformaGenerator = () => {
    mainFunction();
}