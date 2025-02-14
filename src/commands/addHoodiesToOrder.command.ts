import { ICommand } from "./ICommand";
import { DBPool } from "../database";
import {QueryResult} from "pg";
import {hoodies} from "../interfaces/hoodies";


export class AddHoodiesToOrderCommand implements ICommand<Promise<void>, [hoodieNames: string[], orderId: number, quantity: number]> {

    async execute(hoodieNames: string[], orderId: number, quantity: number): Promise<void> {
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
            const hoodies_quantity = hoodieResult.rows.map(hoodie => ({
                ...hoodie,
                quantity: quantity
            }));

            const orderResult = await DBPool.query(`
                SELECT "orderItems", "totalPrice"
                FROM "Orders"
                WHERE "orderId" = $1
            `, [orderId]);
            const existingOrderItems = orderResult.rows[0].orderItems;

            const updatedOrderItems = [...existingOrderItems, ...hoodies_quantity];
            if(hoodies_quantity.length === 0) {
                throw new Error('No hoodies found');
            }
            const newHoodiesPrice = updatedOrderItems.reduce((sum, hoodie) => sum + (hoodie.price * hoodie.quantity), 0);
            const formattedOrderItems = updatedOrderItems.map(item => JSON.stringify(item));
            await DBPool.query(`
                UPDATE "Orders"
                SET "orderItems" = $1::jsonb[], "totalPrice" = $2
                WHERE "orderId" = $3
            `, [formattedOrderItems, newHoodiesPrice, orderId]);

            await DBPool.query('COMMIT');
        } catch (e) {
            await DBPool.query('ROLLBACK');
            throw e;
        }
    }
}
