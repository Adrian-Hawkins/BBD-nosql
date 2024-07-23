import { Request, Response } from 'express';
import { Controller, Get, Post } from "../lib/decorators";
import { controller, EndpointDefenition } from '../lib/interfaces';
import { DBPool } from '../database';

@Controller('/health')
export class HelloController implements controller {
  // Define these to make the interface happy
  endpoint!: string;
  endpoints!: { [key: string]: EndpointDefenition; };
  // define these to make the array in index.ts happy
  static endpoint = '';
  static endpoints = {}



  @Get('/')
  async test(req: Request, res: Response) {
    res.send({
      message: "Healthy"
    });
  }

  @Post('/echo')
  echo(req: Request, res: Response) {
    const { message } = req.body;
    res.send(`You said: hey`);
  }
  
}