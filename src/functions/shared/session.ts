import { Session } from '../../models/management/session';
import { defaultSessionTime } from '../../configrations/session';

export const createSession = (userid: string, userip: string): Session => {
    let newSession: Session = { user_id: userid, user_ip: userip, timestamp: Date.now(), expire_date: (Date.now() + defaultSessionTime) ,_id: null, _rev: null }
    return newSession;
}

export const isSessionExpired = (session: Session) => {
    if (Date.now() >= session.expire_date) {
        return true;
    } else {
        return false;
    }
}