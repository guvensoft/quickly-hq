import { BuyersItemIdentification } from "./BuyersItemIdentification";
import { Country } from "./Country";
import { CommodityClassification } from "./CommodityClassification";
import { ItemInstance } from "./ItemInstance";

/**
 * Item
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface Item {
    /** xs:string */
    Description?: string;
    /** xs:string */
    Name?: string;
    /** xs:string */
    Keyword?: string;
    /** xs:string */
    BrandName?: string;
    /** xs:string */
    ModelName?: string;
    /** BuyersItemIdentification */
    BuyersItemIdentification?: BuyersItemIdentification;
    /** SellersItemIdentification */
    SellersItemIdentification?: BuyersItemIdentification;
    /** ManufacturersItemIdentification */
    ManufacturersItemIdentification?: BuyersItemIdentification;
    /** AdditionalItemIdentification[] */
    AdditionalItemIdentification?: Array<BuyersItemIdentification>;
    /** OriginCountry */
    OriginCountry?: Country;
    /** CommodityClassification[] */
    CommodityClassification?: Array<CommodityClassification>;
    /** ItemInstance[] */
    ItemInstance?: Array<ItemInstance>;
}
