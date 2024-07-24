import {IQuery} from "./IQuery";
import {DBPool} from "../database";
import {hoodies} from "../interfaces/hoodies";
import { QueryResult } from "pg";

export class GetSHoodiesQuery implements IQuery<Promise<hoodies| null>,[name:string]>{


    async execute(name:string){
        const { rows }: QueryResult<hoodies> = await DBPool.query(`
            SELECT 
                "name",
                "price",
                "hoodieDetails",
                "hoodieSizes"    
            FROM "Hoodies"
            WHERE "name" LIKE $1
        `, [`%${name}%`]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }
}