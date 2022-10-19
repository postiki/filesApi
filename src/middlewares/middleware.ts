import { NextFunction, Request, RequestHandler, Response } from 'express';

export abstract class Middleware {
  public use(): RequestHandler {
    return this.handle.bind(this);
  }

  protected abstract handle(req: Request, res: Response, next: NextFunction): unknown;
}
