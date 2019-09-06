export class Supplier {
    constructor(
        public name: string,
        public description: string,
        public address: string,
        public phone_number: number,
        public email: string,
        public tax_no: number,
        public account_id: string,
        public products: Array<string>,
        public status: number,
        public timestamp: number
    ) { }
}