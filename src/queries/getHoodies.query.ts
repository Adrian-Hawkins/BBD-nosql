import {IQuery} from "./IQuery";
import {DBPool} from "../database";
import {hoodies} from "../interfaces/hoodies";
import { QueryResult } from "pg";

export class GetHoodiesQuery implements IQuery<Promise<hoodies[]>>{


    async execute(){
        const { rows }: QueryResult<hoodies> = await DBPool.query(`
            SELECT 
                "name",
                "price",
                "hoodieDetails",
                "hoodieSizes",
                "color"
            FROM "Hoodies";
        `);
        return rows;
    }
}