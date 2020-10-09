/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.time(`${req.method}: ${req.originalUrl}`);

    res.on('finish', () => console.timeEnd(`${req.method}: ${req.originalUrl}`));

    next();
  }
}
