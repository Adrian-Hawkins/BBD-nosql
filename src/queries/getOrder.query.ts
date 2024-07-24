import {IQuery} from "./IQuery";
import {DBPool} from "../database";
import { QueryResult } from "pg";
import {Order} from "../interfaces/order";

export class GetOrderQuery implements IQuery<Promise<Order>, [orderId: string]>{


    async execute(orderId: string){
        try {
            const result: QueryResult<Order> = await DBPool.query(`
                SELECT 
                    c."email" AS "customerEmail",
                    o."orderDate",
                    o."totalPrice",
                    o."orderItems",
                    o."orderComplete"
                FROM "Orders" o
                JOIN "Customers" c ON o."customerId" = c."customerId"
                WHERE o."orderId" = $1
            `, [orderId]);

            if (result.rows.length === 0) {
                throw new Error(`Order with ID ${orderId} not found`);
            }

            return result.rows[0];

        } catch(e) {
            throw e;
        }
    }
}