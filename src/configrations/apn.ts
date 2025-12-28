import { Provider, ProviderOptions ,ProviderToken, Notification, NotificationAlertOptions ,Responses } from 'apn';
import { APN_AUTHKEY_PATH } from './paths';

const providerOptions:ProviderOptions = {
    token: {
        key: APN_AUTHKEY_PATH,
        keyId: "788GCC9YS7",
        teamId: "92DP42XCF9"
    },
    production: false
};

export const deviceToken = '780578097711ae28d0ad7f33078ba3a4ad6a054cf95ac0b0b65559ce931a062a';

export const apnProvider = new Provider(providerOptions)

export const sendNotifications = () => {
    let note = new Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = "❤️ Love?";
    note.payload = {'messageFrom': 'John Appleseed'};
    note.topic = "tr.com.quickly.mobile";
    return apnProvider.send(note,deviceToken)
}