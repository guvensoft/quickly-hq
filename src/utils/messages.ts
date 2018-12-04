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
            message: "Hesap Silindi.",
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