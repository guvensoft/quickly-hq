import joi from 'joi';

export const AuthSchemaSafe = joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
});

export const UserSchemaSafe = joi.object().keys({
    username: joi.string().trim().required(),
    password: joi.string().trim().required(),
    fullname: joi.string().required(),
    email: joi.string().required().email({ minDomainAtoms: 2 }),
    phone_number: joi.number().required(),
    group: joi.string().required(),
    avatar: joi.string()
});

export const UserSchema = joi.object().keys({
    username: joi.string().trim(),
    password: joi.string().trim(),
    fullname: joi.string(),
    email: joi.string().email({ minDomainAtoms: 2 }),
    phone_number: joi.number(),
    group: joi.string(),
    avatar: joi.string()
});

export const OwnerSchemaSafe = joi.object().keys({
    username: joi.string().trim().required(),
    password: joi.string().trim().required(),
    fullname: joi.string().required(),
    email: joi.string().required().email({ minDomainAtoms: 2 }),
    phone_number: joi.number().required(),
    account: joi.string().required(),
    stores: joi.array().items(joi.string()).min(1).required(),
    avatar: joi.string(),
    type: joi.number().allow(0, 1, 2, 3).required(),
    status: joi.number().allow(0, 1, 2).required(),
});

export const OwnerSchema = joi.object().keys({
    username: joi.string().trim(),
    password: joi.string().trim(),
    fullname: joi.string(),
    email: joi.string().email({ minDomainAtoms: 2 }),
    phone_number: joi.number(),
    account: joi.string(),
    stores: joi.array().items(joi.string()).min(1),
    avatar: joi.string(),
    type: joi.number().allow(0, 1, 2, 3),
    status: joi.number().allow(0, 1, 2)
});

export const AccountSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    description: joi.string().required(),
    type: joi.number().only(0, 1, 2, 3).required(),
    status: joi.number().only(0, 1, 2)
});

export const AccountSchema = joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    type: joi.number().only(0, 1, 2, 3),
    status: joi.number().only(0, 1, 2)
});

export const GroupSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    description: joi.string().required(),
    canRead: joi.boolean().required(),
    canWrite: joi.boolean().required(),
    canEdit: joi.boolean().required(),
    canDelete: joi.boolean().required()
});

export const GroupSchema = joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    canRead: joi.boolean(),
    canWrite: joi.boolean(),
    canEdit: joi.boolean(),
    canDelete: joi.boolean()
});

export const DatabaseSchemaSafe = joi.object().keys({
    host: joi.string().ip().required(),
    port: joi.number().port().required(),
    username: joi.string().trim().required(),
    password: joi.string().trim().required(),
    codename: joi.string().required()
});

export const DatabaseSchema = joi.object().keys({
    host: joi.string().ip(),
    port: joi.number().port(),
    username: joi.string().trim(),
    password: joi.string().trim(),
    codename: joi.string()
});

export const AdressSchema = joi.object().keys({
    country: joi.string(),
    city: joi.string(),
    province: joi.string(),
    district: joi.string(),
    street: joi.string(),
    description: joi.string(),
    cordinates: joi.object().keys({
        latitude: joi.number(),
        longitude: joi.number()
    })
});

export const PaymentMethodSchema = joi.object().keys({
    name: joi.string(),
    type: joi.number().allow(0, 1, 2, 3),
    description: joi.string()
});

export const PaymentMethodSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    type: joi.number().allow(0, 1, 2, 3).required(),
    description: joi.string()
});

export const StoreDaysSettingsSchema = joi.object().keys({
    is_open: joi.boolean(),
    opening: joi.string(),
    closing: joi.string()
});

export const StoreWifiSettingsSchema = joi.object().keys({
    ssid: joi.string(),
    password: joi.string(),
});

export const StoreAccesibiltySchema = joi.object().keys({
    days: joi.object().keys({
        0: StoreDaysSettingsSchema,
        1: StoreDaysSettingsSchema,
        2: StoreDaysSettingsSchema,
        3: StoreDaysSettingsSchema,
        4: StoreDaysSettingsSchema,
        5: StoreDaysSettingsSchema,
        6: StoreDaysSettingsSchema,
    }),
    wifi: StoreWifiSettingsSchema,
    others: joi.array().items(joi.string()).max(20)
});

export const StoreSettingsSchema = joi.object().keys({
    order: joi.boolean(),
    preorder: joi.boolean(),
    reservation: joi.boolean(),
    accesibilty: StoreAccesibiltySchema,
    allowed_tables: joi.boolean(),
    allowed_products: joi.boolean(),
    allowed_payments: joi.array().items(joi.string())
})

export const StoreAuthSchema = joi.object().keys({
    database_id: joi.string(),
    database_name: joi.string(),
    database_user: joi.string(),
    database_password: joi.string(),
})

export const StoreAuthSchemaSafe = joi.object().keys({
    database_id: joi.string().required(),
    database_name: joi.string().required(),
})

export const StoreSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    type: joi.number().allow(0, 1, 2).required(),
    category: joi.array().items(joi.number().allow(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23)).required(),
    cuisine: joi.array().items(joi.number().allow(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90)).required(),
    address: AdressSchema.required(),
    motto: joi.string().required(),
    description: joi.string().required(),
    logo: joi.string().required(),
    auth: StoreAuthSchemaSafe.required(),
    settings: StoreSettingsSchema,
    accounts: joi.array().items(joi.string()).required(),
    status: joi.number().allow(0, 1, 2, 3).required(),
    email: joi.string().required().email({ minDomainAtoms: 2 }),
    phone_number: joi.number().required(),
});

export const StoreSchema = joi.object().keys({
    name: joi.string(),
    type: joi.number().allow(0, 1, 2),
    category: joi.array().items(joi.number().allow(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23)),
    cuisine: joi.array().items(joi.number().allow(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90)),
    address: AdressSchema,
    motto: joi.string(),
    description: joi.string(),
    logo: joi.string(),
    auth: StoreAuthSchemaSafe,
    settings: StoreSettingsSchema,
    accounts: joi.array().items(joi.string()),
    status: joi.number().allow(0, 1, 2, 3),
    email: joi.string().email({ minDomainAtoms: 2 }),
    phone_number: joi.number(),
});

export const SupplierSchema = joi.object().keys({
    logo: joi.string(),
    name: joi.string(),
    description: joi.string(),
    address: AdressSchema,
    phone_number: joi.number(),
    email: joi.string(),
    web_site: joi.string().uri(),
    tax_no: joi.number(),
    account: joi.string(),
    products: joi.array().items(joi.string()),
    status: joi.number(),
});

export const SupplierSchemaSafe = joi.object().keys({
    logo: joi.string().required(),
    name: joi.string().required(),
    description: joi.string().required(),
    address: AdressSchema.required(),
    phone_number: joi.number().required(),
    email: joi.string().required(),
    web_site: joi.string().uri(),
    tax_no: joi.number().required(),
    account: joi.string().required(),
    products: joi.array().items(joi.string()),
    status: joi.number().required(),
});

export const ProducerSchema = joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    account: joi.string(),
    logo: joi.string(),
    status: joi.number()
});

export const ProducerSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    description: joi.string().required(),
    account: joi.string().required(),
    logo: joi.string().required(),
    status: joi.number().required()
});

export const ProductSchema = joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    category: joi.string(),
    sub_category: joi.string(),
    unit: joi.string(),
    portion: joi.number(),
    producer_id: joi.string(),
    tax_value: joi.number(),
    image: joi.string(),
    ingredients: joi.string(), // joi.array().items(joi.string())
    tags: joi.string(), // joi.array().items(joi.string())
    calorie: joi.number(),
    barcode: joi.number(),
    status: joi.number()
});

export const ProductSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().required(),
    sub_category: joi.string().required(),
    unit: joi.string().required(),
    portion: joi.number().required(),
    producer_id: joi.string().required(),
    tax_value: joi.number().required(),
    image: joi.string().required(),
    ingredients: joi.string().required(), // joi.array().items(joi.string())
    tags: joi.string().required(), // joi.array().items(joi.string())
    calorie: joi.number().required(),
    barcode: joi.number().required(),
    status: joi.number().required()
});