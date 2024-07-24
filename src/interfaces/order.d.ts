import {Customer} from "./customer";

export interface Order {
    customer: Customer;
    orderDate: Date;
    orderStatus: string;
    totalPrice: number;
    orderItems: object[];
    orderComplete: boolean;
}