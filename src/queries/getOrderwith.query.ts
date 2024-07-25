import {IQuery} from "./IQuery";
import {DBPool} from "../database";

export class GetOrderWithQuery implements IQuery<Promise<any>,[email: string, key: string, value: any]>{
    async execute(email: string, key: string, value: any) {
        const valueType = typeof value === 'string' ? 'text' : 'jsonb';
        try {
            const result = await DBPool.query(`
                SELECT DISTINCT o."orderId", o."orderDate", o."totalPrice", o."orderItems", o."orderComplete"
                FROM "Orders" o
                         JOIN "Customers" c ON o."customerId" = c."customerId"
                         JOIN LATERAL (
                    SELECT item
                    FROM unnest(o."orderItems") AS item
                    ) AS expanded_items ON true
                         JOIN "Hoodies" h ON (item ->> 'hoodieId')::INT = h."hoodieId"
                WHERE c."email" = $1
                  AND h."hoodieDetails" @> jsonb_build_object($2::text, $3::${valueType})
            `, [email, key, value]);
            return result.rows;
        }
        catch (e) {
            throw e;
        }
    }
}