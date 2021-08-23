import { Product, Category, SubCategory } from "./product";
import { User, UserGroup } from "./user";
import { Floor, Table } from "./table";
import { Stock } from "./stocks";

export type reportType = 'Product' | 'Category' | 'SubCategory' | 'Table' | 'Floor' | 'User' | 'Group';
export type activityType = 'Product' | 'Category' | 'SubCategory' | 'Table' | 'Floor' | 'User' | 'Group';

export interface Report {
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
    db_name?: string;
    db_seq?: number;
    _id?: string;
    _rev?: string;
}

export interface Activity {
    type: string;
    name: string;
    activity: Array<number>;
    activity_time: Array<any>;
    activity_count: Array<number>;
    _id?: string;
    _rev?: string;
}

export const createActivity = (activityType: activityType, activityName: string): Activity => {
    return {
        type: activityType,
        name: activityName,
        activity: [],
        activity_time: [],
        activity_count: [],
    }
}

export const createReport = (reportType: reportType, reportObj: Product | Table | Floor | User | UserGroup | Category | SubCategory | Stock): Report => {
    const date = new Date();
    // const daysLength = new Date(date.getFullYear(), (date.getMonth() + 1), 0).getDate();
    const weeklyArray = new Array(7).fill(0, 0, 7);
    const monthlyArray = new Array(12).fill(0, 0, 12);
    return {
        type: reportType,
        connection_id: reportObj._id,
        count: 0,
        amount: 0,
        profit: 0,
        weekly: weeklyArray,
        weekly_count: weeklyArray,
        monthly: monthlyArray,
        monthly_count: monthlyArray,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        description: reportObj.name,
        timestamp: Date.now(),
        db_name: 'reports',
        db_seq: 0
    }
}