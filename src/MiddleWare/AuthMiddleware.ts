import {NextFunction, Request, Response} from "express";
import {isGitHubTokenValid} from "../util/validateToken";

export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.method== 'OPTIONS' || req.url === '/auth/code' || req.url === '/auth/getToken' || req.url === '/health'){
        next();
        return;
    }

    try {
        const authed = await isGitHubTokenValid(`${req.headers.authorization}`);
        if (authed) {
            next();
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (e) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}