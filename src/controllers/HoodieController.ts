import { Request, Response } from 'express';
import { Controller, Get, Post } from "../lib/decorators";
import { controller, EndpointDefenition } from '../lib/interfaces';
import { DBPool } from '../database';
import {CreateHoodieCommand} from "../commands/createHoodie.command";
import {GetHoodiesQuery} from "../queries/getHoodies.query";
import {GetSHoodiesQuery} from "../queries/getSHoodie.query";

@Controller('/hoodie')
export class HoodieController implements controller {

    endpoint!: string;
    endpoints!: { [key: string]: EndpointDefenition; };

    static endpoint = '';
    static endpoints = {}

    @Post('/create')
    async create(req: Request, res: Response) {
        try {
            const {name, price, details, size} = req.body;
            const cmd = new CreateHoodieCommand();
            await cmd.execute(name, price, details, size);
            res.send({
                "message": "Hoodie created"
            });
        }catch(e){
            res.status(500).send({
                "message": `Error: ${e}`
            });
        }
    }

    @Get('/all')
    async all(req: Request, res: Response) {
        try {
            const query = new GetHoodiesQuery()
            const hoodies = await query.execute();
            res.send(hoodies);
        }catch(e){
            res.status(500).send({
                "message": `Error: ${e}`
            });
        }
    }

    @Get('/:name')
    async specific(req: Request, res: Response) {
        try {
            const {name} = req.params;
            const query = new GetSHoodiesQuery()
            const hoodie = await query.execute(name);
            res.send({
                result: hoodie
            });
        }catch(e){
            res.status(500).send({
                "message": `Error: ${e}`
            });
        }
    }

}