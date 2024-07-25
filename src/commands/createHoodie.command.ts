import {ICommand} from "./ICommand";
import {DBPool} from "../database";
import {hoodieSize} from "../types/hoodieSize";
import {HoodieColours} from "../types/hoodieColours";

export class CreateHoodieCommand implements ICommand<Promise<void>,[name:string, price: number, details: string, size: hoodieSize, colour: HoodieColours]>{


    async execute(name:string, price: number, details: string, size: hoodieSize, colour: HoodieColours){
        const { rows } = await DBPool.query(`
            INSERT INTO "Hoodies" ("name", "price", "hoodieDetails", "hoodieSizes", "color")
            VALUES
            ($1, $2, $3, $4::"hoodieSize", $5::"hoodieColor")
        `, [name, price, JSON.stringify(details), size, colour]);
    }
}