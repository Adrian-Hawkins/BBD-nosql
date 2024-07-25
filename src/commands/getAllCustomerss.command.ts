
import {ICommand} from "./ICommand";
import {DBPool} from "../database";

export class GetAllCustomersCommand implements ICommand<Promise<any>,[]>{
    async execute(){
        try {
            await DBPool.query('BEGIN');

            const customersResult = await DBPool.query(`
                SELECT * FROM "Customers" 
            `, []);

            const orders = customersResult.rows;

            await DBPool.query('COMMIT');
            return orders;
        } catch (e) {
            await DBPool.query('ROLLBACK');
            throw e;
        }
    }
}