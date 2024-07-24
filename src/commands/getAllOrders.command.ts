
import {ICommand} from "./ICommand";
import {DBPool} from "../database";

export class GetAllOrdersCommand implements ICommand<Promise<any>,[]>{
    async execute(){
        try {
            await DBPool.query('BEGIN');

            const ordersResult = await DBPool.query(`
                SELECT * FROM "Orders" 
            `, []);

            const orders = ordersResult.rows;

            await DBPool.query('COMMIT');
            return orders;
        } catch (e) {
            await DBPool.query('ROLLBACK');
            throw e;
        }
    }
}