import { Definition } from "./Definition";
import { ReceiverboxAliases } from "./ReceiverboxAliases";

/**
 * Value
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Value1 {
    /** Definition */
    Definition?: Definition;
    /** ReceiverboxAliases[] */
    ReceiverboxAliases?: Array<ReceiverboxAliases>;
    /** SenderboxAliases[] */
    SenderboxAliases?: Array<ReceiverboxAliases>;
    /** DespatchReceiverboxAliases[] */
    DespatchReceiverboxAliases?: Array<ReceiverboxAliases>;
    /** DespatchSenderboxAliases[] */
    DespatchSenderboxAliases?: Array<ReceiverboxAliases>;
}
