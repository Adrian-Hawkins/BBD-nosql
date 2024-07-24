import {ICommand} from "./ICommand";
import {DBPool} from "../database";

export class GetOrdersByCustomerCommand implements ICommand<Promise<any>,[email:string]>{

    async execute(email:string){
        try {
            await DBPool.query('BEGIN');

            const ordersResult = await DBPool.query(`
                SELECT * FROM "Orders" 
                INNER JOIN "Customers" 
                  ON "Orders"."customerId" = "Customers"."customerId"
                WHERE "Customers"."email" = $1
            `, [email]);

            const orders = ordersResult.rows;
            console.log(orders);

            await DBPool.query('COMMIT');
            return orders;
        } catch (e) {
            await DBPool.query('ROLLBACK');
            throw e;
        }
    }
}