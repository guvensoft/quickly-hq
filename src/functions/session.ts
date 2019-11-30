import { Session } from '../models/management/session';
import { defaultSessionTime } from '../configrations/session';

export const createSession = (userID: string, userIP: string): Session => {
    let newSession: Session = { user_id: userID, user_ip: userIP, timestamp: Date.now(), expire_date: (Date.now() + 3600000) }
    return newSession;
}