import {ICommand} from "./ICommand";
import {DBPool} from "../database";
import {hoodieSize} from "../types/hoodieSize";
import {QueryResult} from "pg";
import {Order} from "../interfaces/order";

export class CompleteOrderCommand implements ICommand<Promise<void>,[orderId:string]>{

    async execute(orderId:string){
        try {
            await DBPool.query('BEGIN');
            // Get all items in order items array
            const orderResult: QueryResult<{orderItems: any[]}> = await DBPool.query(`
                SELECT "orderItems"
                FROM "Orders"
                WHERE "orderId" = $1
            `, [orderId]);
            const total = orderResult.rows[0].orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            console.log(total)
            const result = await DBPool.query(`
                UPDATE "Orders"
                SET "orderComplete" = true,
                    "totalPrice" = $1
                WHERE "orderId" = $2
            `, [total, orderId]);

            if (result.rowCount === 0) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            await DBPool.query('COMMIT');
        } catch (e) {
            await DBPool.query('ROLLBACK');
            throw e;
        }
    }
}