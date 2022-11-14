import { Provider, ProviderOptions ,ProviderToken, Notification, NotificationAlertOptions ,Responses } from 'apn';
import { apnAuthKeyPath } from './paths';

const providerOptions:ProviderOptions = {
    token: {
        key: apnAuthKeyPath,
        keyId: "788GCC9YS7",
        teamId: "92DP42XCF9"
    },
    production: false
};

export const deviceToken = '6178ccccec35cb00295bdf66bba862274fd311f5905637c3aea816e06e878ddc';

export const apnProvider = new Provider(providerOptions)

export const sendNotifications = () => {
    let note = new Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = "\u2709 Yeni Mesajınız Var";
    note.payload = {'messageFrom': 'John Appleseed'};
    note.topic = "tr.com.quickly.mobile";
    return apnProvider.send(note,deviceToken)
}