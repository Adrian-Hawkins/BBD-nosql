import {ICommand} from "./ICommand";
import {DBPool} from "../database";

export class CreateCustomerCommand implements ICommand<Promise<number>,[email:string]>{

    async execute(email:string){
        try {
            await DBPool.query('BEGIN');

            const customerResult = await DBPool.query(`
                WITH existing_customer AS (
                    SELECT "customerId"
                    FROM "Customers"
                    WHERE "email" = $1
                ), new_customer AS (
                    INSERT INTO "Customers" ("email")
                    SELECT $1
                    WHERE NOT EXISTS (SELECT 1 FROM existing_customer)
                    RETURNING "customerId"
                )
                SELECT "customerId" FROM existing_customer
                UNION ALL
                SELECT "customerId" FROM new_customer
            `, [email]);

            const customerId = customerResult.rows[0].customerId;

            await DBPool.query('COMMIT');
            return customerId;
        } catch (e) {
            await DBPool.query('ROLLBACK');
            throw e;
        }
    }
}