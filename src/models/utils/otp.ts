export interface OtpCheck {
    owner: string,
    code: number,
    expiry: number
    _id?: string,
    _rev?: string,
}