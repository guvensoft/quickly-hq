import NestPay from 'node-nestpay';

const nestPay = new NestPay({
    name: 'quicklyhq',
    password: 'zUXnAMmP92Lj7yC',
    clientId: 700668268733,
    // storekey: 668268733,
    mode: 'T',
    currency: 'TRY',
    endpoint: 'isbank',
    lang: 'tr'
});

interface PurchaseSuccessResponse {
    OrderId: string,
    GroupId: string,
    Response: string,
    AuthCode: string,
    HostRefNum: string,
    ProcReturnCode: string,
    TransId: string,
    ErrMsg: string,
    Extra: {
        SETTLEID: string,
        TRXDATE: string,
        ERRORCODE: string,
        CARDBRAND: string,
        CARDISSUER: string,
        CARDHOLDERNAME: string,
        HOSTDATE: string,
        SECMELIKAMPANYASONUC: string,
        NUMCODE: string
    }
}

export const processPurchase = (card_number: string, year: string, month: string, cvv: string, amount: string): Promise<PurchaseSuccessResponse> => {
    return nestPay.purchase({
        number: card_number,
        year: year,
        month: month,
        cvv: cvv,
        amount: amount
    });
}

export const processAuthorize = (card_number: string, year: string, month: string, cvv: string, amount: string): Promise<any> => {
    return nestPay.authorize({
        number: card_number,
        year: year,
        month: month,
        cvv: cvv,
        amount: amount
    })
}

export const processCapture = (order_id: string): Promise<any> => {
    return nestPay.capture({
        orderId: order_id
    });
}

export const processRefund = (order_id: string, amount: number): Promise<any> => {
    return nestPay.refund({
        orderId: order_id,
        amount: amount
    });
}

export const processVoid = (order_id: string): Promise<any> => {
    return nestPay.void({
        orderId: order_id
    })
}
