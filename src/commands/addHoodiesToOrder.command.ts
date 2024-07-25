import { ICommand } from "./ICommand";
import { DBPool } from "../database";
import {QueryResult} from "pg";
import {hoodies} from "../interfaces/hoodies";


export class AddHoodiesToOrderCommand implements ICommand<Promise<void>, [hoodieNames: string[], orderId: number]> {

    async execute(hoodieNames: string[], orderId: number): Promise<void> {
        try {
            await DBPool.query('BEGIN');
            const hoodieResult = await DBPool.query(`
                SELECT 
                    "hoodieId",
                    "name",
                    "price",
                    "hoodieSizes" AS size,
                    "color" AS colour,
                    "hoodieDetails" AS details
                FROM "Hoodies"
                WHERE "name" = ANY($1)
            `, [hoodieNames]);
            const hoodies: hoodies[] = hoodieResult.rows;

            const orderResult = await DBPool.query(`
                SELECT "orderItems", "totalPrice"
                FROM "Orders"
                WHERE "orderId" = $1
            `, [orderId]);
            const existingOrderItems = orderResult.rows[0].orderItems;
            const existingTotalPrice = orderResult.rows[0].totalPrice;

            const updatedOrderItems = [...existingOrderItems, ...hoodies];
            const newHoodiesPrice = hoodies.reduce((sum, hoodie) => sum + hoodie.price, 0);
            const updatedTotalPrice = existingTotalPrice + newHoodiesPrice;
            const formattedOrderItems = updatedOrderItems.map(item => JSON.stringify(item));
            await DBPool.query(`
                UPDATE "Orders"
                SET "orderItems" = $1::jsonb[], "totalPrice" = $2
                WHERE "orderId" = $3
            `, [formattedOrderItems, updatedTotalPrice, orderId]);

            await DBPool.query('COMMIT');
        } catch (e) {
            await DBPool.query('ROLLBACK');
            throw e;
        }
    }
}
