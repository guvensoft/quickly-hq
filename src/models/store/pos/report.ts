import { Product, Category, SubCategory } from "./product";
import { User, UserGroup } from "./user";
import { Floor, Table } from "./table";
import { Stock } from "./stocks";

export type reportType = 'Product' | 'Category' | 'SubCategory' | 'Table' | 'Floor' | 'User' | 'Group';
export type activityType = 'Product' | 'Category' | 'SubCategory' | 'Table' | 'Floor' | 'User' | 'Group';


export class Report {
    type: reportType;
    connection_id: string;
    count: number;
    amount: number;
    profit: number;
    weekly: Array<number>;
    weekly_count: Array<number>;
    monthly: Array<number>;
    monthly_count: Array<number>;
    month: number;
    year: number;
    description: string;
    timestamp: number;
    _id?: string;
    _rev?: string;

    // constructor(reportType: reportType, reportObj: Product | Table | Floor | User | UserGroup | Category | SubCategory | Stock) {
    //     let date = new Date();
    //     let daysLegth = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
    //     let weeklyArray = new Array(7).fill(0, 0, 7);
    //     let monthlyArray = new Array(daysLegth).fill(0, 0, daysLegth);
    //     this.type = reportType;
    //     this.connection_id = reportObj._id;
    //     this.count = 0;
    //     this.amount = 0;
    //     this.profit = 0;
    //     this.weekly = weeklyArray;
    //     this.weekly_count = weeklyArray;
    //     this.monthly = monthlyArray;
    //     this.monthly_count = monthlyArray;
    //     this.month = date.getMonth() + 1;
    //     this.year = date.getFullYear();
    //     this.description = reportObj.name;
    //     this.timestamp = Date.now();
    // }
}

export class Activity {
    type: string;
    name: string;
    activity: Array<number>;
    activity_time: Array<any>;
    activity_count: Array<number>;
    _id?: string;
    _rev?: string;

    constructor(activityType: string, activityName: string) {
        this.type = activityType;
        this.name = activityName;
        this.activity = [];
        this.activity_time = [];
        this.activity_count = [];
    }
}

// export const Report = (reportType: reportType, reportObj: Product | Table | Floor | User | UserGroup | Category | SubCategory | Stock): Report => {
//     let date = new Date();
//     let daysLegth = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
//     let weeklyArray = new Array(7).fill(0, 0, 7);
//     let monthlyArray = new Array(daysLegth).fill(0, 0, daysLegth);
//     return {
//         type: reportType,
//         connection_id: reportObj._id,
//         count: 0,
//         amount: 0,
//         profit: 0,
//         weekly: weeklyArray,
//         weekly_count: weeklyArray,
//         monthly: monthlyArray,
//         monthly_count: monthlyArray,
//         month: date.getMonth() + 1,
//         year: date.getFullYear(),
//         description: reportObj.name,
//         timestamp: Date.now(),
//     }
// }