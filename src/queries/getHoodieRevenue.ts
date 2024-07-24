import {IQuery} from "./IQuery";
import {DBPool} from "../database";

export class GetHoodieRevenue implements IQuery<Promise<any>,[hoodieId: number]>{
    async execute(hoodieId: number){
        try {
            const result = await DBPool.query(`
              WITH OrderItemsExpanded AS (
                  SELECT "orderId","orderComplete", item
                  FROM "Orders",
                  unnest("orderItems") AS item
              ),
              RelevantOrders AS (
                  SELECT "orderId", "orderComplete", item
                  FROM OrderItemsExpanded
                  WHERE (item::jsonb->>'hoodieId')::INTEGER = $1
                    AND "orderComplete" = true
              ),
              HoodieSales AS (
                SELECT 
                    item->>'hoodieId' AS hoodieId,
                    CAST(item->>'price' AS FLOAT) AS price
                FROM 
                    relevantOrders
                WHERE 
                    (item->>'hoodieId')::INTEGER = $1
              )
              SELECT 
                    COALESCE(SUM(price), 0) AS total_sales
              FROM 
                    HoodieSales
              WHERE 
                    hoodieId = $1;
            `, [hoodieId]);
            return result.rows;
        } catch(e) {
            throw(e);
        }
    }
}