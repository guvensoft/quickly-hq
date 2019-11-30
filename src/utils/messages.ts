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

export const ProducerMessages = {
    PRODUCER_CREATED: {
        response: {
            ok: true,
            message: "Üretici oluşturuldu.",
        },
        code: 201
    },
    PRODUCER_NOT_CREATED: {
        response: {
            ok: false,
            message: "Üretici oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    PRODUCER_UPDATED: {
        response: {
            ok: true,
            message: "Üretici Düzenlendi.",
        },
        code: 200
    },
    PRODUCER_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Üretici Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    PRODUCER_DELETED: {
        response: {
            ok: true,
            message: "Üretici Silindi.",
        },
        code: 200
    },
    PRODUCER_NOT_DELETED: {
        response: {
            ok: false,
            message: "Üretici Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    PRODUCER_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Üretici Adı mevcut. Lütfen farklı bir Üretici adı giririniz.",
        },
        code: 406
    },
    PRODUCER_NOT_EXIST: {
        response: {
            ok: false,
            message: "Üretici Bulunamadı",
        },
        code: 404
    },
}

export const BrandMessages = {
    BRAND_CREATED: {
        response: {
            ok: true,
            message: "Marka oluşturuldu.",
        },
        code: 201
    },
    BRAND_NOT_CREATED: {
        response: {
            ok: false,
            message: "Marka oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    BRAND_UPDATED: {
        response: {
            ok: true,
            message: "Marka Düzenlendi.",
        },
        code: 200
    },
    BRAND_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Marka Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    BRAND_DELETED: {
        response: {
            ok: true,
            message: "Marka Silindi.",
        },
        code: 200
    },
    BRAND_NOT_DELETED: {
        response: {
            ok: false,
            message: "Marka Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    BRAND_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Marka Adı mevcut. Lütfen farklı bir Marka adı giririniz.",
        },
        code: 406
    },
    BRAND_NOT_EXIST: {
        response: {
            ok: false,
            message: "Marka Bulunamadı",
        },
        code: 404
    },
}

export const ProductMessages = {
    PRODUCT_CREATED: {
        response: {
            ok: true,
            message: "Ürün oluşturuldu.",
        },
        code: 201
    },
    PRODUCT_NOT_CREATED: {
        response: {
            ok: false,
            message: "Ürün oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    PRODUCT_UPDATED: {
        response: {
            ok: true,
            message: "Ürün Düzenlendi.",
        },
        code: 200
    },
    PRODUCT_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Ürün Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    PRODUCT_DELETED: {
        response: {
            ok: true,
            message: "Ürün Silindi.",
        },
        code: 200
    },
    PRODUCT_NOT_DELETED: {
        response: {
            ok: false,
            message: "Ürün Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    PRODUCT_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Ürün Adı mevcut. Lütfen farklı bir Ürün adı giririniz.",
        },
        code: 406
    },
    PRODUCT_NOT_EXIST: {
        response: {
            ok: false,
            message: "Ürün Bulunamadı",
        },
        code: 404
    },
}

export const SupplierMessages = {
    SUPPLIER_CREATED: {
        response: {
            ok: true,
            message: "Tedarikçi oluşturuldu.",
        },
        code: 201
    },
    SUPPLIER_NOT_CREATED: {
        response: {
            ok: false,
            message: "Tedarikçi oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    SUPPLIER_UPDATED: {
        response: {
            ok: true,
            message: "Tedarikçi Düzenlendi.",
        },
        code: 200
    },
    SUPPLIER_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Tedarikçi Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    SUPPLIER_DELETED: {
        response: {
            ok: true,
            message: "Tedarikçi Silindi.",
        },
        code: 200
    },
    SUPPLIER_NOT_DELETED: {
        response: {
            ok: false,
            message: "Tedarikçi Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    SUPPLIER_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Tedarikçi Adı mevcut. Lütfen farklı bir Tedarikçi adı giririniz.",
        },
        code: 406
    },
    SUPPLIER_NOT_EXIST: {
        response: {
            ok: false,
            message: "Tedarikçi Bulunamadı",
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

export const TableMessages = {
    TABLE_CREATED: {
        response: {
            ok: true,
            message: "Masa Oluşturuldu!",
        },
        code: 201
    },
    TABLE_NOT_CREATED: {
        response: {
            ok: false,
            message: "Masa Oluşturalamadı!",
        },
        code: 400
    },
    TABLE_UPDATED: {
        response: {
            ok: true,
            message: "Masa Güncellendi!",
        },
        code: 200
    },
    TABLE_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Masa Güncellenemedi!",
        },
        code: 400
    },
    TABLE_DELETED: {
        response: {
            ok: true,
            message: "Masa Silindi!",
        },
        code: 200
    },
    TABLE_NOT_DELETED: {
        response: {
            ok: false,
            message: "Masa Silinemedi!",
        },
        code: 400
    },
    TABLE_EXIST: {
        response: {
            ok: false,
            message: "Belirtilen Masa Var!",
        },
        code: 406
    },
    TABLE_NOT_EXIST: {
        response: {
            ok: false,
            message: "Masa Bulunamadı!",
        },
        code: 404
    },
}

export const StockMessages = {
    STOCK_CREATED: {
        response: {
            ok: true,
            message: "Stok Oluşturuldu!",
        },
        code: 201
    },
    STOCK_NOT_CREATED: {
        response: {
            ok: false,
            message: "Stok Oluşturalamadı!",
        },
        code: 400
    },
    STOCK_UPDATED: {
        response: {
            ok: true,
            message: "Stok Güncellendi!",
        },
        code: 200
    },
    STOCK_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Stok Güncellenemedi!",
        },
        code: 400
    },
    STOCK_DELETED: {
        response: {
            ok: true,
            message: "Stok Silindi!",
        },
        code: 200
    },
    STOCK_NOT_DELETED: {
        response: {
            ok: false,
            message: "Stok Silinemedi!",
        },
        code: 400
    },
    STOCK_EXIST: {
        response: {
            ok: false,
            message: "Belirtilen Stok Var!",
        },
        code: 406
    },
    STOCK_NOT_EXIST: {
        response: {
            ok: false,
            message: "Stok Bulunamadı!",
        },
        code: 404
    },
}

export const FloorMessages = {
    FLOOR_CREATED: {
        response: {
            ok: true,
            message: "Bölge Oluşturuldu!",
        },
        code: 201
    },
    FLOOR_NOT_CREATED: {
        response: {
            ok: false,
            message: "Bölge Oluşturalamadı!",
        },
        code: 400
    },
    FLOOR_UPDATED: {
        response: {
            ok: true,
            message: "Bölge Güncellendi!",
        },
        code: 200
    },
    FLOOR_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Bölge Güncellenemedi!",
        },
        code: 400
    },
    FLOOR_DELETED: {
        response: {
            ok: true,
            message: "Bölge Silindi!",
        },
        code: 200
    },
    FLOOR_NOT_DELETED: {
        response: {
            ok: false,
            message: "Bölge Silinemedi!",
        },
        code: 400
    },
    FLOOR_EXIST: {
        response: {
            ok: false,
            message: "Belirtilen Bölge Var!",
        },
        code: 406
    },
    FLOOR_NOT_EXIST: {
        response: {
            ok: false,
            message: "Bölge Bulunamadı!",
        },
        code: 404
    },
}

export const CategoryMessages = {
    CATEGORY_CREATED: {
        response: {
            ok: true,
            message: "Kategori Oluşturuldu!",
        },
        code: 201
    },
    CATEGORY_NOT_CREATED: {
        response: {
            ok: false,
            message: "Kategori Oluşturalamadı!",
        },
        code: 400
    },
    CATEGORY_UPDATED: {
        response: {
            ok: true,
            message: "Kategori Güncellendi!",
        },
        code: 200
    },
    CATEGORY_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Kategori Güncellenemedi!",
        },
        code: 400
    },
    CATEGORY_DELETED: {
        response: {
            ok: true,
            message: "Kategori Silindi!",
        },
        code: 200
    },
    CATEGORY_NOT_DELETED: {
        response: {
            ok: false,
            message: "Kategori Silinemedi!",
        },
        code: 400
    },
    CATEGORY_EXIST: {
        response: {
            ok: false,
            message: "Belirtilen Kategori Var!",
        },
        code: 406
    },
    CATEGORY_NOT_EXIST: {
        response: {
            ok: false,
            message: "Kategori Bulunamadı!",
        },
        code: 404
    },
}

export const CashboxEntryMessages = {
    ENTRY_CREATED: {
        response: {
            ok: true,
            message: "Kasa Girdisi oluşturuldu.",
        },
        code: 201
    },
    ENTRY_NOT_CREATED: {
        response: {
            ok: false,
            message: "Kasa Girdisi oluşturulamadı! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    ENTRY_UPDATED: {
        response: {
            ok: true,
            message: "Kasa Girdisi Düzenlendi.",
        },
        code: 200
    },
    ENTRY_NOT_UPDATED: {
        response: {
            ok: false,
            message: "Kasa Girdisi Düzenlenemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    ENTRY_DELETED: {
        response: {
            ok: true,
            message: "Kasa Girdisi Silindi.",
        },
        code: 200
    },
    ENTRY_NOT_DELETED: {
        response: {
            ok: false,
            message: "Kasa Girdisi Silinemedi! Lütfen tekrar deneyin.",
        },
        code: 400
    },
    ENTRY_EXIST: {
        response: {
            ok: false,
            message: "Girmiş olduğunuz Kasa Girdisi Adı mevcut. Lütfen farklı bir kullanıcı adı giririniz.",
        },
        code: 406
    },
    ENTRY_NOT_EXIST: {
        response: {
            ok: false,
            message: "Kasa Girdisi Bulunamadı",
        },
        code: 404
    },
}