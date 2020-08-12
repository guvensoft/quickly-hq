import { Session } from '../models/management/session';
import { defaultSessionTime } from '../configrations/session';

export const createSession = (userid: string, userip: string): Session => {
    let newSession: Session = { user_id: userid, user_ip: userip, timestamp: Date.now(), expire_date: (Date.now() + 3600000) }
    return newSession;
}