import {ICommand} from "./ICommand";
import {DBPool} from "../database";
import {hoodieSize} from "../types/hoodieSize";
import {QueryResult} from "pg";
import {Order} from "../interfaces/order";

export class CompleteOrderCommand implements ICommand<Promise<void>,[orderId:string]>{

    async execute(orderId:string){
        try {
            const result = await DBPool.query(`
                UPDATE "Orders"
                SET "orderComplete" = true
                WHERE "orderId" = $1
            `, [orderId]);
            console.log(result);

            if (result.rowCount === 0) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
        } catch (e) {
            throw e;
        }
    }
}