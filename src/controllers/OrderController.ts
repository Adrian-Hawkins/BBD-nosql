import { Request, Response } from 'express';
import { Controller, Get, Patch, Post } from "../lib/decorators";
import { controller, EndpointDefenition } from '../lib/interfaces';
import {CreateOrderCommand} from "../commands/createOrder.command";
import {AddHoodiesToOrderCommand} from "../commands/addHoodiesToOrder.command";
import {GetOrderQuery} from "../queries/getOrder.query";
import {CompleteOrderCommand} from "../commands/completeOrder.command";
import {GetOrderWithQuery} from "../queries/getOrderwith.query";
import { GetOrdersByCustomerCommand } from '../commands/getOrdersByCustomerEmail.command';
import { GetAllOrdersCommand } from '../commands/getAllOrders.command';

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
        const quantity = req.body.quantity != null ? parseInt(req.body.quantity, 10) : 1;
        try {
            const cmd = new AddHoodiesToOrderCommand();
            await cmd.execute(hoodieNames, orderId, quantity);
            res.send({
                message: "success"
            });
        } catch(e: any) {
            res.status(500).send({
                message: "Failed to add to order",
                info: e.message
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

    @Post('/withKey')
    async withKey(req: Request, res: Response) {
        const { email, key, value } = req.body;
        try {
            const query = new GetOrderWithQuery();
            const orders = await query.execute(email, key, value);
            res.send({
                message: "success",
                orders
            });
        } catch(e) {
            res.status(500).send({
                message: "Something went wrong"
            })
        }
    }

    @Get('/getByEmail/:email')
    async getOrdersByEmail(req: Request, res: Response) {
        const { email } = req.params;
        try {
            const cmd = new GetOrdersByCustomerCommand()
            const orders = await cmd.execute(email);
            res.send({
                message: "success",
                orders
            });
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
                e
            });
        }
    }

    @Get('/all')
    async getAll(req: Request, res: Response) {
        try {
            const cmd = new GetAllOrdersCommand()
            const orders = await cmd.execute();
            res.send({
                message: "success",
                orders
            });
        } catch (e) {
            res.status(500).send({
                message: "Something went wrong",
                e
            });
        }
    }
}