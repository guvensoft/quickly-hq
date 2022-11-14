
export interface UBL {
    Invoice:{
        UBLExtensions: {
            UBLExtension:
            {
                ExtensionContent: {
                    Signature: {
                        SignedInfo: {
                            CanonicalizationMethod: string;
                            SignatureMethod: string;
                            Reference: ({
                                DigestMethod: string;
                                DigestValue: string;
                                Transforms?: undefined;
                            } | {
                                Transforms: {
                                    Transform: string;
                                };
                                DigestMethod: string;
                                DigestValue: string;
                            })[];
                        };
                        SignatureValue: string;
                        KeyInfo: {
                            X509Data: {
                                X509Certificate: string;
                            };
                            KeyValue: {
                                RSAKeyValue: {
                                    Modulus: string;
                                    Exponent: string;
                                };
                            };
                        };
                        Object: {
                            QualifyingProperties: {
                                SignedProperties: {
                                    SignedSignatureProperties: {
                                        SigningTime: string;
                                        SigningCertificate: {
                                            Cert: {
                                                CertDigest: {
                                                    DigestMethod: string;
                                                    DigestValue: string;
                                                };
                                                IssuerSerial: {
                                                    X509IssuerName: string;
                                                    X509SerialNumber: number;
                                                };
                                            };
                                        };
                                        SignerRole: {
                                            ClaimedRoles: {
                                                ClaimedRole: string;
                                            };
                                        };
                                    };
                                    SignedDataObjectProperties: {
                                        DataObjectFormat: {
                                            MimeType: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        UBLVersionID: number;
        CustomizationID: string;
        ProfileID: string;
        ID: string;
        CopyIndicator: boolean;
        UUID: string;
        IssueDate: string;
        IssueTime: string;
        InvoiceTypeCode: string;
        Note: string | string[];
        DocumentCurrencyCode: string;
        LineCountNumeric: number;
        AdditionalDocumentReference: {
            ID: string;
            IssueDate: string;
            DocumentType: string;
            Attachment: {
                EmbeddedDocumentBinaryObject: string;
            };
            DocumentTypeCode?: undefined;
            DocumentDescription?: undefined;
        };
        Signature: {
            ID: number;
            SignatoryParty: {
                PartyIdentification: {
                    ID: number;
                };
                PostalAddress: {
                    ID: string;
                    Room: string;
                    StreetName: string;
                    BuildingNumber: string;
                    CitySubdivisionName: string;
                    CityName: string;
                    PostalZone: string;
                    District: string;
                    Country: {
                        Name: string;
                    };
                };
            };
            DigitalSignatureAttachment: {
                ExternalReference: {
                    URI: string;
                };
            };
        };
        AccountingSupplierParty: {
            Party: {
                PartyIdentification: {
                    ID: number;
                };
                PartyName: {
                    Name: string;
                };
                PostalAddress: {
                    Room: number;
                    StreetName: string;
                    BlockName: string;
                    BuildingName: string;
                    BuildingNumber: number;
                    CitySubdivisionName: string;
                    CityName: string;
                    PostalZone: number;
                    District: string;
                    Country: {
                        Name: string;
                    };
                };
                PartyTaxScheme: {
                    TaxScheme: {
                        Name: string;
                    };
                };
                Contact: {
                    Telephone: string;
                    Telefax: string;
                    ElectronicMail:string;
                };
                WebsiteURI:string
            };
        };
        AccountingCustomerParty: {
            Party: {
                PartyIdentification: {
                    ID: number;
                };
                PartyName: {
                    Name: string;
                };
                PostalAddress: {
                    Room: number;
                    StreetName: string;
                    BlockName: string;
                    BuildingName: string;
                    BuildingNumber: number;
                    CitySubdivisionName: string;
                    CityName: string;
                    PostalZone: number;
                    District: string;
                    Country: {
                        Name: string;
                    };
                };
                PartyTaxScheme: {
                    TaxScheme: {
                        Name: string;
                    };
                };
                Contact: {
                    Telephone: string;
                    Telefax: string;
                    ElectronicMail:string;
                };
                WebsiteURI:string
            };
        };
        PaymentTerms: string,
        AllowanceCharge: {
          ChargeIndicator: boolean,
          AllowanceChargeReason: string,
          MultiplierFactorNumeric: number,
          SequenceNumeric: number,
          Amount: number,
          BaseAmount: number
        },
        TaxTotal: {
            TaxAmount: number;
            TaxSubtotal: {
                TaxableAmount: number;
                TaxAmount: number;
                Percent: number;
                TaxCategory: {
                    TaxScheme: {
                        Name: string;
                        TaxTypeCode: number;
                    };
                };
            }[];
        };
        LegalMonetaryTotal: {
            LineExtensionAmount: number;
            TaxExclusiveAmount: number;
            TaxInclusiveAmount: number;
            AllowanceTotalAmount: number;
            PayableRoundingAmount: number;
            PayableAmount: number;
        };
        InvoiceLine: {
            ID: number;
            InvoicedQuantity: number;
            LineExtensionAmount: number;
            AllowanceCharge: {
                ChargeIndicator: boolean,
                AllowanceChargeReason: string,
                MultiplierFactorNumeric: number,
                Amount: number,
                BaseAmount: number
            };
            TaxTotal: {
                TaxAmount: number;
                TaxSubtotal: {
                    TaxableAmount: number;
                    TaxAmount: number;
                    Percent: number;
                    TaxCategory: {
                        TaxScheme: {
                            Name: string;
                            TaxTypeCode: number;
                        };
                    };
                };
            };
            Item: {
                Name: string;
                Note: string;
                SellersItemIdentification: {
                    ID: string;
                };
            };
            Price: {
                PriceAmount: number;
            };
        }[];
    }
}
