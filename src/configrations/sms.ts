import NetGsm from 'netgsm';
import { netGsmUsername, netGsmPassword, netGsmBrand } from './secrets';

const netgsm = new NetGsm({ usercode: netGsmUsername, password: netGsmPassword, msgheader: netGsmBrand });

export const sendSms = async (phone_number: string, message: string) => {
    try {
        let isSended = await netgsm.get("sms/send/get/", {
            gsmno: phone_number,
            message: message,
        });
        if(isSended.status == 200){
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}