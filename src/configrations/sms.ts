import NetGsm from 'netgsm';
import { NETGSM_USERNAME, NETGSM_PASSWORD, NETGSM_BRAND } from './secrets';

const netgsm = new NetGsm({ usercode: NETGSM_USERNAME, password: NETGSM_PASSWORD, msgheader: NETGSM_BRAND });

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