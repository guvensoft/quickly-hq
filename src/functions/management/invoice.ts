import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, InvoiceType, InvoiceStatus, InvoiceItem, Currency } from '../../models/management/invoice';
import { Logo, Icon, NormalFont, BoldFont } from '../../utils/blobs';
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

const ProformaHead = "PROFORMA FATURA";
const headCompanyName = QuicklyCompany.name
const headCompanyTax = `${QuicklyCompany.tax_administration} Vergi Dairesi - Vergi No: ${QuicklyCompany.tax_no}`;
const headCompanyAddress = QuicklyCompany.address.description;
const headCompanySocial = `${QuicklyCompany.website} - ${QuicklyCompany.email} - ${QuicklyCompany.phone_number}`;

const normalFont = "Normal";
const boldFont = "Bold"
const tableColor = '#D9534F';



export async function generateInvoicePDF(invoiceData: Invoice) {

    const invoiceColumns     = ["#", "Ürün/Hizmet", "Adet", "KDV", "Birim Fiyat", "Toplam Fiyat "];
    const productTotalColumn = ["Ürün/Hizmet Toplam                    :"];
    const taxRateColumn      = ["KDV (%18)                                     :"];
    const totalColumn        = ["Genel Toplam                               :"];
    const tableSpace         = "           ";

    const invoice = invoiceData;
    const customerName = invoice.to.name;
    const customerAddress = invoice.to.address.description;
    const cutomerCompanyTax = `${invoice.to.tax_administration} Vergi Dairesi - Vergi No: ${invoice.to.tax_no}`;
    const customerCompanySocial = `${invoice.to.website} - ${invoice.to.email} - ${invoice.to.phone_number}`;

    const date = new Date();
    const month = [date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const dayLong = new Date().toLocaleString('tr-TR', { weekday: 'long' });
    const year = date.getFullYear();
    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString();

    var selectedCurrency;

    const getCurrency = (currency: Currency) => {
        return axios.get('https://api.genelpara.com/embed/doviz.json').then(res => {
            res.data[currency].satis = res.data[currency].satis.replace("<a href=https://www.genelpara.com/doviz/dolar/ style=display:none;>Dolar kaç tl</a>", "");
            selectedCurrency = res.data[currency].satis;
            return selectedCurrency;
        })
    }
    const addSidebar = (PDF:jsPDF) => {
        // Right bar blue line
        PDF.setFillColor('#2B3E50');
        PDF.setDrawColor('#2B3E50');
        PDF.rect(520, 0, 75, 845, 'FD');
    
        PDF.addImage(Icon, 'PNG', 600, 760, 87, 87, null, null, 90);
    
        /// Right bar logo text 
        PDF.setFontSize(10);
        PDF.setTextColor(255, 255, 255);
        PDF.text(headCompanyName + '    ' + headCompanyTax, 540, 770, null, 90);
        // PDF.text(, 540, 480, null, 90);
        PDF.text(headCompanyAddress, 560, 770, null, 90);
        PDF.text(headCompanySocial, 580, 770, null, 90);
    }
    const addInvoiceTotalTable = (PDF:jsPDF) => {
        console.log('total Works  for')
        const offset = 250;
        let offsetY = 22 + (invoice.items.length * 32) - (invoice.items.length * 2);
        productTotalColumn[0] = `${productTotalColumn[0] + tableSpace + invoice.sub_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'}`;
        autoTable(PDF, {
            // tableWidth: 300,
            // startX: 700,
            startY: offset + offsetY,
            pageBreak: 'avoid',
            headStyles: {
                fillColor: tableColor,
                textColor: [255, 255, 255],
                halign: 'left',
                lineWidth: 1,
                lineColor: [0, 0, 0],
                cellWidth: 210
    
            },
            head: [productTotalColumn],
            // body: [productTotalColumn],
            margin: { left: 285 },
            theme: 'grid',
            styles: {
                fontSize: 8,
                font: boldFont,
            },
            columnStyles: { 0: { cellWidth: 210 } }
        });
    
        // Tax table
        taxRateColumn[0] = `${taxRateColumn[0].concat(tableSpace) + invoice.tax_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'}`;
        autoTable(PDF, {
            // tableWidth: 190,
            // startX: 700,
            startY: offset + 19 + offsetY,
            pageBreak: 'avoid',
            headStyles: {
                fillColor: tableColor,
                textColor: [255, 255, 255],
                halign: 'left',
                lineWidth: 1,
                lineColor: [0, 0, 0],
                cellWidth: 210
            },
            head: [taxRateColumn],
            // body: [taxRateRow],
            margin: { left: 285 },
            theme: 'grid',
            styles: {
                fontSize: 8,
                font: boldFont,
            },
            columnStyles: { 0: { cellWidth: 0 } }
        });
    
        //  Total table
        totalColumn[0] = `${totalColumn[0].concat(tableSpace) + invoice.total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL'}`;
        autoTable(PDF, {
            // tableWidth: 190,
            // startX: 700,
            startY: offset + 38 + offsetY,
            pageBreak: 'avoid',
            headStyles: {
                fillColor: tableColor,
                textColor: [255, 255, 255],
                halign: 'left',
                lineWidth: 1,
                lineColor: [0, 0, 0],
                cellWidth: 210
    
            },
            head: [totalColumn],
            // body: [totalRow],
            margin: { left: 285 },
            theme: 'grid',
            styles: {
                fontSize: 8,
                font: boldFont,
            },
            columnStyles: { 0: { cellWidth: 210 } }
        });
    }
    const addProformBody = (PDF:jsPDF, currency:string) => {
        PDF.addImage(Logo, 'PNG', 20, 20, 100, 50);
        PDF.setFontSize(9);
        PDF.setTextColor(0, 0, 255);
        PDF.text(headCompanyName, 215, 25);
        PDF.setFontSize(8);
        PDF.setTextColor(0, 0, 0);
        PDF.text(headCompanyTax, 215, 35);
        PDF.text(headCompanyAddress, 215, 45);
        PDF.text(headCompanySocial, 215, 55);
        PDF.setFontSize(17);
        PDF.text(ProformaHead, 175, 130);
    
        // Date
        PDF.setTextColor(0, 0, 255);
        PDF.setFontSize(10);
        PDF.text(day + '/' + month + '/' + year + ' ' + dayLong, 355, 200);
        PDF.text("Dolar: " + parseFloat(currency).toFixed(2) + " TRY", 356, 215);
        // PDF.text("Euro : " + parseFloat(curr).toFixed(2) + " TRY", 356, 215);
    
        PDF.setTextColor(0, 0, 255);
        PDF.setFontSize(9);
        PDF.text(hour + ":" + minute + " UTC", 440, 215);
    }
    const addCustomerCompany = (PDF:jsPDF) => {
        PDF.setFontSize(9);
        PDF.setTextColor(0, 0, 255);
        PDF.text(customerName, 20, 200);
        PDF.setTextColor(0, 0, 0);
        PDF.setFontSize(8);
        PDF.text(PDF.splitTextToSize(cutomerCompanyTax, 300), 20, 212);
        PDF.setFontSize(8);
        PDF.text(PDF.splitTextToSize(customerCompanySocial, 300), 20, 222);
        PDF.setFontSize(8);
        PDF.text(PDF.splitTextToSize(customerAddress, 300), 20, 232);
    }
    const addInvoiceTable = (PDF:jsPDF) => {
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
                return [index + 1, item.name + '\n' + item.description, item.quantity, '% ' + item.tax_value, item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + currencyTransformer(item.currency), priceCalculator(item)]
            }),
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
    const priceCalculator = (item: InvoiceItem) => {
        if (item.currency !== 'TRY') {
            return (item.price * item.quantity * selectedCurrency).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' TL';
        } else {
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

    try {
        const curr = await getCurrency('USD');

        let PDF = new jsPDF('portrait', 'pt');
        PDF.addFileToVFS("Normal.ttf", NormalFont);
        PDF.addFileToVFS("Bold.ttf", BoldFont);
        PDF.addFont("Normal.ttf", "Normal", "normal");
        PDF.addFont("Bold.ttf", "Bold", "bold");
        PDF.setFont("Normal");

        addProformBody(PDF,curr);
        addSidebar(PDF);
        addCustomerCompany(PDF);
        addInvoiceTable(PDF);
        addInvoiceTotalTable(PDF);
        // PDF.save(Date.now() + '.pdf');
        return PDF.output('arraybuffer');
    } catch (err) {
        console.log(err);
    }
}

//#region 
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
//#endregion