
import { Request, Response } from 'express';
import { Controller, Get, Post } from "../lib/decorators";
import { controller, EndpointDefenition } from '../lib/interfaces';
import { DBPool } from '../database';
import {CreateHoodieCommand} from "../commands/createHoodie.command";
import {GetHoodiesQuery} from "../queries/getHoodies.query";
import {GetSHoodiesQuery} from "../queries/getSHoodie.query";
import { CreateCustomerCommand } from '../commands/createCustomer.command';
import { GetAllCustomersCommand } from '../commands/getAllCustomerss.command';

@Controller('/customer')
export class CustomerController implements controller {

    endpoint!: string;
    endpoints!: { [key: string]: EndpointDefenition; };

    static endpoint = '';
    static endpoints = {}

    @Post('/create')
    async create(req: Request, res: Response) {
        try {
            const {email} = req.body;
            const cmd = new CreateCustomerCommand();
            const ID = await cmd.execute(email);
            res.send({
                "message": "Customer Created",
                ID
            });
        }catch(e){
            res.status(500).send({
                "message": `Error: ${e}`
            });
        }
    }

    @Get('/all')
    async getAllCustomers(req: Request, res: Response) {
        try {
            const cmd = new GetAllCustomersCommand();
            const customers = await cmd.execute();
            res.send({
                "message": "Success",
                customers
            });
        }catch(e){
            res.status(500).send({
                "message": `Error: ${e}`
            });
        }
    }
}