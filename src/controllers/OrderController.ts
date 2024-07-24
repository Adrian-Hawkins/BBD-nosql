import { Request, Response } from 'express';
import { Controller, Get, Patch } from "../lib/decorators";
import { controller, EndpointDefenition } from '../lib/interfaces';
import {CreateOrderCommand} from "../commands/createOrder.command";
import {AddHoodiesToOrderCommand} from "../commands/addHoodiesToOrder.command";
import {GetOrderQuery} from "../queries/getOrder.query";
import {CompleteOrderCommand} from "../commands/completeOrder.command";

@Controller('/order')
export class OrderController implements controller {

    endpoint!: string;
    endpoints!: { [key: string]: EndpointDefenition; };

    static endpoint = '';
    static endpoints = {}


    @Get('/create/:email')
    async createOrder(req: Request, res: Response) {
        try {
            const command = new CreateOrderCommand();
            const { email } = req.params;
            const orderId = await command.execute(email);
            res.send({
                message: "success",
                orderId: orderId
            });
        } catch(e) {
            res.status(500).send({
                message: e,
                info: e
            });
        }
    }

    @Patch('/addToOrder')
    async addToOrder(req: Request, res: Response) {
        const { hoodieNames, orderId } = req.body;
        try {
            const cmd = new AddHoodiesToOrderCommand();
            await cmd.execute(hoodieNames, orderId);
            res.send({
                message: "success"
            });
        } catch(e) {
            res.status(500).send({
                message: "Failed to add to order",
                info: e
            })
        }
    }

    @Get('/getOrder/:orderId')
    async getOrder(req: Request, res: Response) {
        const { orderId } = req.params;
        try {
            const query = new GetOrderQuery();
            const order = await query.execute(orderId);
            res.send({
                message: "success",
                order
            });
        } catch(e) {
            res.status(500).send({
                message: "Failed to add to order",
                info: e
            });
        }
    }

    @Get('/complete/:orderId')
    async completeOrder(req: Request, res: Response) {
        const { orderId } = req.params;
        try {
            const cmd = new CompleteOrderCommand();
            await cmd.execute(orderId);
            res.send({
                message: "Order successfully completed"
            })
        } catch (e) {
            res.status(500).send({
                message: "Failed to complete order",
                info: e
            });
        }
    }

}