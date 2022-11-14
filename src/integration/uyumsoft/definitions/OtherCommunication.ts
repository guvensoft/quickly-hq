import { ChannelCode } from "./ChannelCode";

/**
 * OtherCommunication
 * @targetNSAlias `tns`
 * @targetNamespace `urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2`
 */
export interface OtherCommunication {
    /** ChannelCode */
    ChannelCode?: ChannelCode;
    /** xs:string */
    Channel?: string;
    /** xs:string */
    Value?: string;
}
