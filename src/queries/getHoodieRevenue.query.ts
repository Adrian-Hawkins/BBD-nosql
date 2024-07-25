import {IQuery} from "./IQuery";
import {DBPool} from "../database";

export class GetHoodieRevenueQuery implements IQuery<Promise<any>,[name: string]>{
    async execute(name: string){
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
                  WHERE (item::jsonb->>'name') = $1
                    AND "orderComplete" = true
              ),
              HoodieSales AS (
                SELECT 
                    item->>'name' AS name,
                    CAST(item->>'price' AS FLOAT) AS price
                FROM 
                    relevantOrders
                WHERE 
                    (item->>'name') = $1
              )
              SELECT 
                    COALESCE(SUM(price), 0) AS total_sales
              FROM 
                    HoodieSales
              WHERE 
                    name = $1;
            `, [name]);
            return result.rows;
        } catch(e) {
            throw(e);
        }
    }
}