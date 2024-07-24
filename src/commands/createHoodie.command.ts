import {ICommand} from "./ICommand";
import {DBPool} from "../database";
import {hoodieSize} from "../types/hoodieSize";

export class CreateHoodieCommand implements ICommand<Promise<void>,[name:string, price: number, details: string, size: hoodieSize]>{


    async execute(name:string, price: number, details: string, size: hoodieSize){
        const { rows } = await DBPool.query(`
            INSERT INTO "Hoodies" ("name", "price", "hoodieDetails", "hoodieSizes")
            VALUES
            ($1, $2, $3, $4::"hoodieSize");
        `, [name, price, JSON.stringify(details), size]);
    }
}