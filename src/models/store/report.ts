export type reportType = 'Product' | 'Category' | 'SubCategory' | 'Table' | 'Floor' | 'User' | 'Group' | 'Stock' | 'Customer' ;
export type activityType = 'Product' | 'Category' | 'SubCategory' | 'Table' | 'Floor' | 'User' | 'Group' | 'Stock' | 'Customer' ;

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