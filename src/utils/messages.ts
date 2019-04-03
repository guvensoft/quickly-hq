export const UserMessages = {
    USER_CREATED: {
        response: {
            ok: true,
            message: "Kullanıcı oluşturuldu.",
        },
        code: 201
    },
    USER_NOT_CREATED: {
        response: {
            ok: false,
            message: "Kullanıcı oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    USER_UPDATED: {
        response: {
            ok: true,
            message: "Kullanıcı Düzenlendi.",
        },
        code: 200
    },
    USER_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Kullanıcı Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    USER_DELETED: {
        response: {
            ok: true,
            message: "Kullanıcı Silindi.",
        },
        code: 200
    },
    USER_NOT_DELETED: {
        response: {
            ok: false,
            message: "Kullanıcı Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    USER_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Kullanıcı Adı mevcut. Lütfen farklı bir kullanıcı adı giririniz.",
        },
        code: 406
    },
    USER_NOT_EXIST: {
        response: {
            ok: false,
            message: "Kullanıcı Bulunamadı",
        },
        code: 404
    },
}

export const AccountMessages = {
    ACCOUNT_CREATED: {
        response: {
            ok: true,
            message: "Hesap oluşturuldu.",
        },
        code: 201
    },
    ACCOUNT_NOT_CREATED: {
        response: {
            ok: false,
            message: "Hesap oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    ACCOUNT_UPDATED: {
        response: {
            ok: true,
            message: "Hesap Düzenlendi.",
        },
        code: 200
    },
    ACCOUNT_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Hesap Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    ACCOUNT_DELETED: {
        response: {
            ok: true,
            message: "Hesap Silindi.",
        },
        code: 200
    },
    ACCOUNT_NOT_DELETED: {
        response: {
            ok: false,
            message: "Hesap Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    ACCOUNT_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Hesap Adı mevcut. Lütfen farklı bir Hesap adı giririniz.",
        },
        code: 406
    },
    ACCOUNT_NOT_EXIST: {
        response: {
            ok: false,
            message: "Hesap Bulunamadı",
        },
        code: 404
    },
}

export const OwnerMessages = {
    OWNER_CREATED: {
        response: {
            ok: true,
            message: "Hesap Sahibi oluşturuldu.",
        },
        code: 201
    },
    OWNER_NOT_CREATED: {
        response: {
            ok: false,
            message: "Hesap Sahibi oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    OWNER_UPDATED: {
        response: {
            ok: true,
            message: "Hesap Sahibi Düzenlendi.",
        },
        code: 200
    },
    OWNER_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Hesap Sahibi Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    OWNER_DELETED: {
        response: {
            ok: true,
            message: "Hesap Sahibi Silindi.",
        },
        code: 200
    },
    OWNER_NOT_DELETED: {
        response: {
            ok: false,
            message: "Hesap Sahibi Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    OWNER_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Hesap Sahibi Adı mevcut. Lütfen farklı bir kullanıcı adı giririniz.",
        },
        code: 406
    },
    OWNER_NOT_EXIST: {
        response: {
            ok: false,
            message: "Hesap Sahibi Bulunamadı",
        },
        code: 404
    },
}

export const GroupMessages = {
    GROUP_CREATED: {
        response: {
            ok: true,
            message: "Grup oluşturuldu.",
        },
        code: 201
    },
    GROUP_NOT_CREATED: {
        response: {
            ok: false,
            message: "Grup oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    GROUP_UPDATED: {
        response: {
            ok: true,
            message: "Grup Düzenlendi.",
        },
        code: 200
    },
    GROUP_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Grup Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    GROUP_DELETED: {
        response: {
            ok: true,
            message: "Grup Silindi.",
        },
        code: 200
    },
    GROUP_NOT_DELETED: {
        response: {
            ok: false,
            message: "Grup Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    GROUP_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Grup Adı mevcut. Lütfen farklı bir Grup adı giririniz.",
        },
        code: 406
    },
    GROUP_NOT_EXIST: {
        response: {
            ok: false,
            message: "Grup Bulunamadı",
        },
        code: 404
    },
}
export const DatabaseMessages = {
    DATABASE_CREATED: {
        response: {
            ok: true,
            message: "Veritabanı oluşturuldu.",
        },
        code: 201
    },
    DATABASE_NOT_CREATED: {
        response: {
            ok: false,
            message: "Veritabanı oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    DATABASE_UPDATED: {
        response: {
            ok: true,
            message: "Veritabanı Düzenlendi.",
        },
        code: 200
    },
    DATABASE_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Veritabanı Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    DATABASE_DELETED: {
        response: {
            ok: true,
            message: "Veritabanı Silindi.",
        },
        code: 200
    },
    DATABASE_NOT_DELETED: {
        response: {
            ok: false,
            message: "Veritabanı Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    DATABASE_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Veritabanı Adı mevcut. Lütfen farklı bir Veritabanı adı giririniz.",
        },
        code: 406
    },
    DATABASE_NOT_EXIST: {
        response: {
            ok: false,
            message: "Veritabanı Bulunamadı",
        },
        code: 404
    },
}

export const StoreMessages = {
    STORE_CREATED: {
        response: {
            ok: true,
            message: "İşletme oluşturuldu.",
        },
        code: 201
    },
    STORE_NOT_CREATED: {
        response: {
            ok: false,
            message: "İşletme oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    STORE_UPDATED: {
        response: {
            ok: true,
            message: "İşletme Düzenlendi.",
        },
        code: 200
    },
    STORE_NOT_UPDATED: {
        response: {
            ok: false,
            message: "İşletme Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    STORE_DELETED: {
        response: {
            ok: true,
            message: "İşletme Silindi.",
        },
        code: 200
    },
    STORE_NOT_DELETED: {
        response: {
            ok: false,
            message: "İşletme Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    STORE_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz İşletme Adı mevcut. Lütfen farklı bir İşletme adı giririniz.",
        },
        code: 406
    },
    STORE_NOT_EXIST: {
        response: {
            ok: false,
            message: "İşletme Bulunamadı",
        },
        code: 404
    },
}

export const SessionMessages = {
    SESSION_CREATED: {
        response: {
            ok: true,
            message: "Giriş Başarılı!",
        },
        code: 201
    },
    SESSION_NOT_CREATED: {
        response: {
            ok: false,
            message: "Hatalı Kullanıcı Adı veya Parola!",
        },
        code: 400
    },
    SESSION_UPDATED: {
        response: {
            ok: true,
            message: "Oturum Güncellendi!",
        },
        code: 200
    },
    SESSION_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Oturum Başlatılamadı!",
        },
        code: 400
    },
    SESSION_DELETED: {
        response: {
            ok: true,
            message: "Oturum Kapatıldı!",
        },
        code: 200
    },
    SESSION_NOT_DELETED: {
        response: {
            ok: false,
            message: "Oturum Kapatılamadı!",
        },
        code: 400
    },
    SESSION_EXIST: {
        response: {
            ok: true,
            message: "Oturum Devam Ediyor.",
        },
        code: 406
    },
    SESSION_NOT_EXIST: {
        response: {
            ok: false,
            message: "Oturum Bulunamadı!",
        },
        code: 404
    },
    SESSION_EXPIRED: {
        response: {
            ok: false,
            message: "Oturumun Süresi Doldu!",
        },
        code: 401
    },
    UNAUTHORIZED_REQUEST: {
        response: {
            ok: false,
            message: "Yetkisiz İstek!",
        },
        code: 401
    },
}


export const StoreDocumentMessages = {
    DOCUMENT_CREATED: {
        response: {
            ok: true,
            message: "Döküman Oluşturuldu!",
        },
        code: 201
    },
    DOCUMENT_NOT_CREATED: {
        response: {
            ok: false,
            message: "Döküman Oluşturalamadı!",
        },
        code: 400
    },
    DOCUMENT_UPDATED: {
        response: {
            ok: true,
            message: "Döküman Güncellendi!",
        },
        code: 200
    },
    DOCUMENT_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Döküman Güncellenemedi!",
        },
        code: 400
    },
    DOCUMENT_DELETED: {
        response: {
            ok: true,
            message: "Döküman Silindi!",
        },
        code: 200
    },
    DOCUMENT_NOT_DELETED: {
        response: {
            ok: false,
            message: "Döküman Silinemedi!",
        },
        code: 400
    },
    DOCUMENT_EXIST: {
        response: {
            ok: false,
            message: "Belirtilen Döküman Var!",
        },
        code: 406
    },
    DOCUMENT_NOT_EXIST: {
        response: {
            ok: false,
            message: "Döküman Bulunamadı!",
        },
        code: 404
    },
}