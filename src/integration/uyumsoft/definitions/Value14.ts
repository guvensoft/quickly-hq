import { Last10Days } from "./Last10Days";
import { MonthlyReports } from "./MonthlyReports";

/**
 * Value
 * @targetNSAlias `tns`
 * @targetNamespace `http://tempuri.org/`
 */
export interface Value14 {
    /** Last10Days */
    Last10Days?: Last10Days;
    /** MonthlyReports[] */
    MonthlyReports?: Array<MonthlyReports>;
}
