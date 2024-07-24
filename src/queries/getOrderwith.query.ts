import {IQuery} from "./IQuery";
import {DBPool} from "../database";

export class GetOrderWithQuery implements IQuery<Promise<any>,[customerId: number, key: string, value: any]>{
    async execute(customerId: number, key: string, value: any){
        try {
            const valueType = typeof value === 'string' ? 'text' : 'jsonb';

            const result = await DBPool.query(`
                SELECT DISTINCT o."orderId", o."orderDate", o."totalPrice", o."orderItems", o."orderComplete"
                FROM "Orders" o
                         JOIN LATERAL (
                    SELECT item
                    FROM unnest(o."orderItems") AS item
                    ) AS expanded_items ON true
                         JOIN "Hoodies" h ON (item->>'hoodieId')::INT = h."hoodieId"
                WHERE o."customerId" = $1
                  AND h."hoodieDetails" @> jsonb_build_object($2::text, $3::${valueType})
            `, [customerId, key, value]);
            return result.rows;
        } catch(e) {
            throw(e);
        }
    }
}