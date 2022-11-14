export interface AgreementData {
    client: Client,
    bank: Bank,
    pos: Pos,
    menu: Menu,
    device: Device,
    installment: {
        issue_date: string              // düzenlenme tarihi
    },
    setup: {
        issue_date: string              // düzenlenme tarihi
    },
    support: {
        subject: string,               // Burada şikayetin cihaza mı yoksa yazılıma mı ilişkin olduğuna ve şikayetin detaylarına dair açıklama yapılacak'mış
        issue_date: string             // düzenlenme tarihi
    }
}


export interface Client {
    short_name: string,             // müşterinin kısa mekan adı
    full_name: string,              // müşterinin legal ismi
    tax_office: string,             // vergi dairesi
    tax_number: string,             // vergi numarası
    authorised_person: string,      // Yetkili kişi
    address: string,
    email: string,
    user_name: string,
    password: string
}

export interface Bank {
    name: string,                   // banka adı
    branch: string,                 // şube
    owner: string,                  // hesap sahibi
    iban: string,                   // ayben 
    payment_type: string            // binary kullanılabilir. ödeme seçeneği 1 mobilden otomatik, 0 kendisi ibana atıyor.
}

export interface Pos {
    sign_date: string,              // imzalanma tarihi
    start_date: string,             // sözleşme başlangıç TARİHi
    end_date: string,               // sözleşme bitiş TARİHi
    setup_date: string,             // en geç kurulum TARİHi
    remote_supoprt: string,         // uzaktan destek kaç SAAT içinde gerçekleşecek,
    local_support: string,          // yerinde destek kaç SAAT içinde gerçekleşecek
    free_support: string,           // sözleşme süresince kaç ADET/KERE ücretsiz dönüş sağlanacak
    installation_fee: string,       // kurulum ücreti /kdvsiz hali
    total_fee: string               // toplam ücret / kdvsiz hali
}

export interface Menu {
    sign_date: string,              // imzalanma tarihi
    end_date: string,               // sözleşme bitiş TARİHi
    due_date: string,               // en geç teslim TARİHi
    remote_supoprt: string,         // uzaktan destek kaç SAAT içinde gerçekleşecek,
    local_support: string,          // yerinde destek kaç SAAT içinde gerçekleşecek
    free_support: string,           // sözleşme süresince kaç ADET/KERE ücretsiz dönüş sağlanacak
    support_fee: string,            // ücretsiz destek bittikten sonraki destek ÜCRETi
    total_support: string,          // toplam verilecek destek sayısı
    fee: string,                    // menü ücreti
    past_due_fee: string,           // gecikme ücreti
    fee_devided: string,            // ödeme kaç aya bölünecek
    expiry_day: string,             // vade ayın kaçıncı günü
    charge_interest: string         // fatura ödenmemesi durumunda aylık % KAÇ faiz kesileceği
}

export interface Device {                           // sözleşmede ödeme seçeneği ve başlagıç bitiş tarihleri yok
    device: {
        brand: string,              // marka
        model: string,              // model
        serial_no: string,          // seri numarası
        production_year: string,    // üretim yılı
        color: string               // renk
    },
    sign_date: string,              // imzalanma tarihi
    remote_supoprt: string,         // uzaktan destek kaç SAAT içinde gerçekleşecek,
    local_support: string,          // yerinde destek kaç SAAT içinde gerçekleşecek
    free_support: string,           // sözleşme süresince kaç ADET/KERE ücretsiz dönüş sağlanacak
    support_fee: string,            // ücretsiz destek bittikten sonraki destek ÜCRETi
    total_support: string,          // toplam verilecek destek sayısı
    installation_fee: string,       // kurulum ücreti /kdvsiz hali
    total_fee: string               // toplam ücret / kdvsiz hali
}