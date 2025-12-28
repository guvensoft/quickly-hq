import * as soap from "soap";
import * as isnet from '../integration/isnet';
import * as uyumsoft from '../integration/uyumsoft';

import { UBL } from "../models/external/ubl";
import { OptionsV2, Parser, processors } from "xml2js";
import { parseBooleans, parseNumbers } from "xml2js/lib/processors";
import fetch from "node-fetch";
import { UYUMSOFT_WSDL_PATH } from "../configrations/paths";
import { UYUMSOFT_USERNAME } from "../configrations/secrets";
import { UYUMSOFT_PASSWORD } from "../configrations/secrets";
import { ISNET_WSDL_PATH } from "../configrations/paths";

export const uyumsoftInvoice = () => {

    const UYUMSOFT_WSDL_URL = "https://efatura-test.uyumsoft.com.tr/Services/Integration?wsdl";
    const UYUMSOFT_USERNAME = "Uyumsoft";
    const UYUMSOFT_PASSWORD = "Uyumsoft";

    function createSoapClient(wsdlUrl, username, password) {
        return new Promise((resolve, reject) => {
            soap.createClient(wsdlUrl, {}, (err, client) => {
                if (err) {
                    reject(err);
                    return;
                }

                const wsSecurity = new soap.WSSecurity(username, password);
                client.setSecurity(wsSecurity);
                resolve(client);
            });
        });
    }

    async function getInboxInvoices(client) {
        const { GetInboxInvoices } = client;
        const { result, envelope, soapHeader } = await GetInboxInvoices({
            query: {
                PageIndex: 0,
                PageSize: 20,
                ExecutionStartDate: null,
                ExecutionEndDate: null,
                //  InvoiceIds: [],
                //  InvoiceNumbers: [],
                SetTaken: false,
                OnlyNewestInvoices: false,
            },
        });

        if (result?.GetInboxInvoicesResult?.$attributes?.IsSucceded !== "true") {
            return undefined;
        }

        return result.GetInboxInvoicesResult.Value;
    }

    async function main() {
        console.log("Creating SOAP client...");
        const client = await createSoapClient(
            UYUMSOFT_WSDL_URL,
            UYUMSOFT_USERNAME,
            UYUMSOFT_PASSWORD
        );

        console.log(Object.keys(client));

        console.log("Fetching invoice list...");
        const invoiceList = await getInboxInvoices(client);
        if (invoiceList == null) {
            console.error("Invoice list cannot be fetched");
            return;
        }

        const invoiceSummaryList = invoiceList.Items.map((item) => {
            const {
                IssueDate,
                AccountingSupplierParty,
                AccountingCustomerParty,
                LegalMonetaryTotal: { PayableAmount },
            } = item.Invoice;

            return {
                "Issue Date": IssueDate,
                "Accounting Supplier Party": AccountingSupplierParty.Party.PartyName.Name,
                "Accounting Customer Party": AccountingCustomerParty.Party.PartyName.Name,
                Amount: `${PayableAmount.$value} ${PayableAmount.$attributes.currencyID}`,
            };
        });

        console.log("Invoices:");
        console.table(invoiceSummaryList);
        console.log("Done.");
    }

    main();
}

export const soapTEST = () => {
    fetch("https://nettefatura.isnet.net.tr/IncomingInvoice/AllIncomingInvoiceByFilter", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_ga=GA1.3.1753555352.1666362530; Login=VknTckn=16867951058; cookieconsent_status=dismiss; _gid=GA1.3.1560305061.1667316988; NSC_wt_ofuufgbuvsb.jtofu.ofu.us=30dfa3db535567a582f5a6f1a29def41c1f46c1489d232caebb91c7edf5c05a9deb38c6c; __RequestVerificationToken=SZu54480yuqsMrQg3KI9rN0xYLeLNapzqp2NJQTXuRQzZU-38crNSyb1fFYdiXxz0HZ71rHWbA2V8h0asaWi1ilElRV_zYfm7-FYjL4gSGA1; ASP.NET_SessionId=ot3y502pr5tf1egjbomhpss5; .ASPXFORMSAUTH=610E171DB437B6F781386F3E080F1A4315A203E85D09D8D42AED3654055DB0119889E76104AF62A6ADB1E123271702839FCFAAA725F619D9FED56E120620A9E0AAAB5E48FE673290B4CC88FB796F2510374C5E1D5A94FC2AD7DBD83174AFBF650F0435476C856225B6BAA8E283CB21BAC2D0DCCCB21E2D83614C5A2375B2BF582F2D8FFF6D0C0B11541DB5E332238AEB3367C571035F10D4307FC105010D4AB54C028CEFE72D626796234F72C64B92A9526133E67B88389E2B5FC116BB6810EDAF5DFF2EA0B5924EF030DA141E30D62EF23CF739A6C4D9AFB1DB203F1640A727E5FD995962EDD867276FE08FB01EE83F876568182616F37175B4B532B91F79283B9C58F126913A97254A552332B0FB2AFE22489657BE09C5E6BE2032BC1EB38B40D3BD11D6B2E10656F9A144D6A86B7B8979F395A51F4A8BD9B25684BEDC3538375501C2BB17C54191CA5997474BA43EC94AF348B61B47BCD22BE3BF88BDE0E282203786029CCF1DCDB778DFAB98808FF941D8B52C298FF1850BA28D48186106D007FFE480E36F4683292A3353CD22C48BB43E47361BE25EDCCB798A33EFA3B4ED896A2AE9DD8E822EA1E7B59BA46E79CBFCF78293967ECDBABC2D3D4AE2D05752BD0004654610B0B38989CE4096D58C149A6D2612FBE7D853888653BAFBDA25C0CE03E08A25414E1661BCE0E3166F4D7162C61C8BDF14AB362094E1D53F65A3113ACED8E02FA2853D32B19AD7C51251910D5C06A07F3998309BCFA81A0BC3F106A2005555D359638132AD440D8A6E54C46693ACDA81834662FA38D5052A2CD7F70CCF0FD71FA065E5EBE10ADBA874DB4318400870E657EA5880B56B6A430D125E0ECC59916BBF4A5D1DB8218FFBE3D610E2031AB00DF078A0E3A3E391CA4116B2AE2656E44E83B879FE9C5E780C7E41E0C399B988C6F02EE2C9C87D1484D2157BA8A578FABF455A07BB3F31A69469BCF29EA96300555EA8A2014ED01BB4224D5999D19D11D8FFF3813F9150D9B421DA9404F49BD35918D6C74264620B1BE8CF046240F3307E82C6E77A36D1F038E91DA4C8F420CEB1E33F76C3171E801DAB990C5B180529024626930D8D603CEF47606C98CA1F56DC08BC89FFE7E735573F467D5C849FCB74AD19E22B3A7919511FBB37D7D3B39919D7805F1E573681AB4F5D2311C59AE35851B545F795341030A752A9D501D216DF636B9B9F02687203AD6495E77951BC1A4C829B758AC5862A16D2FDFA89031EF514EE73BF0D7265B73104A7D7A655BCAB28DE01F3158C3E0B7BEB3F7AB629E47C2DF1321F4F1D4857AE4F4EE1DB06F1C6C9C2CA8A2B622CA37621; citrix_ns_id=HQ5a+GWNqe3egBKNbulKSDi9sqA0002",
            "Referer": "https://nettefatura.isnet.net.tr/IncomingInvoice/IncomingInvoiceList",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "draw=3&columns%5B0%5D%5Bdata%5D=IdFaturaGelen&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=ActionButtons&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=AliciAdi&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=FaturaNo&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=Ettn&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=FaturaTarihiFormated&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=OdenecekTutarFormatted&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=GelisTarihiFormated&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=SenaryoAdi&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=FaturaTipiAdi&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=DurumAdi&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=OdemeSonucFormatted&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=IadeFaturaNo&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=IdFaturaGelenEk&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B14%5D%5Bdata%5D=14&columns%5B14%5D%5Bname%5D=&columns%5B14%5D%5Bsearchable%5D=true&columns%5B14%5D%5Borderable%5D=true&columns%5B14%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B14%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=7&order%5B0%5D%5Bdir%5D=desc&start=0&length=50&search%5Bvalue%5D=&search%5Bregex%5D=false&FaturaNo=&CompanyIdFilter=109263&VKNTCKN=&AliciAdi=&SenaryoId=&IlkTarih=&SonTarih=&FaturaIlkTarihi=Haziran+1%2C+2022&FaturaSonTarihi=Kas%C4%B1m+2%2C+2022++23%3A59%3A59&MinCost=&MaxCost=&AliciId=0&FaturaDurumu=-1&FaturaOnayDurumu=&FaturaTipiId=&OnlyUnReadedInvoice=false",
        "method": "POST"
    }).then(res => {
        // console.log(res.body);


        res.json().then(ok => {
            console.log(ok.data)
        })

    }).catch(err => {
        console.log(err)
    })

}

export const uyumsoftTest = async () => {





    console.log('WSDL Client Initialize Path: ', UYUMSOFT_WSDL_PATH);

    const parserOpts: OptionsV2 = { ignoreAttrs: true, explicitArray: false, tagNameProcessors: [processors.stripPrefix], valueProcessors: [parseNumbers, parseBooleans] };
    const xmlParser = new Parser(parserOpts);

    try {
        // const guid =
        const security = new soap.WSSecurity(UYUMSOFT_USERNAME, UYUMSOFT_PASSWORD)
        const client = await uyumsoft.createClientAsync(UYUMSOFT_WSDL_PATH);
        client.setSecurity(security);

        const { GetInboxInvoicesAsync, GetSummaryReportAsync, GetInboxInvoiceAsync, } = client;

        const [result,raw] = await GetInboxInvoicesAsync({
            query: {
                ExecutionStartDate: null,
                ExecutionEndDate: null,
                //  InvoiceIds: [],
                //  InvoiceNumbers: [],
            }
        });

        let parsedResult = await xmlParser.parseStringPromise(raw);

        let Invoices: Array<UBL> = parsedResult.Envelope.Body.GetInboxInvoicesResponse.GetInboxInvoicesResult.Value.Items;


       




        

        // let invoices = result.GetInboxInvoicesResult.Value.Items;

        // console.log(invoices[0].Invoice.InvoiceLine.Price.PriceAmount['$value']);



        // let invoices = result.GetInboxInvoicesResult.Value.Items.map(obj => obj.Invoice.ID);

        // for (const inid of invoices) {
        //     const [invoice] = await GetInboxInvoiceAsync({invoiceId:inid});

        //     let data = invoice.GetInboxInvoiceResult;

        //     console.log(data);

        // }


        // const [summary] = await GetSummaryReportAsync({
        //     startDate: null,
        //     endDate: null
        // });

        // console.log(summary.GetSummaryReportResult);


    } catch (error) {
        console.log(error)
    }

}

export const isnetTEST = async () => {





    const TEST_USERNAME = "4059649806";
    const TEST_PASSWORD = "1234"

    try {
        let security = new soap.WSSecurity(TEST_USERNAME, TEST_PASSWORD)
        let client = await isnet.createClientAsync(ISNET_WSDL_PATH);

        client.setSecurity(security);

        const { GetEttnListAsync, SearchInvoiceAsync } = client


        const [invoices,x,y,z] = await SearchInvoiceAsync({
            request: {
                CompanyTaxCode: '1234567805',
                InvoiceDirection:'Incoming',
                ResultSet: {
                    IsAdditionalTaxIncluded: true,
                    IsXMLIncluded: true,
                    IsArchiveIncluded: true,
                    IsAttachmentIncluded:true,
                    IsHtmlIncluded:true,
                    IsInvoiceDetailIncluded:true,
                    IsExternalUrlIncluded:true,
                    IsPDFIncluded:false
                },
                // PagingRequest: {
                //     PageNumber:1,
                //     RecordsPerPage:10
                // }
            }
        })

        // const [ettns] = await GetEttnListAsync({
        //     request: {
        //         CompanyTaxCode: '1234567805',
        //         IncludeMainCompany: 'false',
        //         ResultSet:{
        //             IsXMLIncluded:true
        //         }
        //     }
        // })

        // console.log(ettns.GetEttnListResult)

        console.log(invoices.SearchInvoiceResult);
        // console.log(invoices.SearchAllInvoiceResult)

        // client.InvoiceService.InvoiceServiceBasicHttpEndpoint.SearchAllInvoice({
        //     request:{
        //         CompanyTaxCode:'6140592768',
        //         InvoiceDirection:'Incoming',
        //         ResultSet:{
        //             IsAdditionalTaxIncluded:true,
        //         }

        //     }}, (err, res) => {
        //         if(!err){
        //             console.log(res);
        //         }else{
        //             console.log(err);
        //         }
        // })


        // console.log(invoiceList.GetInboxInvoicesResult.Value.Items.length)


    } catch (error) {
        console.log(error)
    }

}
