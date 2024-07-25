import { Request, Response } from 'express';
import { Controller, Get, Post } from "../lib/decorators";
import { controller, EndpointDefenition } from '../lib/interfaces';
import { DBPool } from '../database';
import {getGitHubDeviceCode} from "../util/getCode";
import {pollGitHubDeviceCode} from "../util/getJWT";

@Controller('/auth')
export class AuthController implements controller {
    endpoint!: string;
    endpoints!: { [key: string]: EndpointDefenition; };

    static endpoint = '';
    static endpoints = {}



    @Get('/code')
    async test(req: Request, res: Response) {
        try {
            const code = await getGitHubDeviceCode();
            res.send({
                message: "Success",
                code
            });
        }
        catch (e) {

            res.status(500).send({
                message: "Failed to get token"
            })
        }
    }

    @Post('/getToken')
    async token(req: Request, res: Response) {
        try {
            const {deviceCode} = req.body;
            const data = await pollGitHubDeviceCode(deviceCode);
            res.send(data);
        }
        catch (e) {
            res.status(500).send({
                message: "Failed to get token"
            })
        }
    }

}