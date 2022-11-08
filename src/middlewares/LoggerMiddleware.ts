import { Request, Response, NextFunction } from 'express';
//middleware для внедрения чего-либо между запросом и контроллером
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Запрос...');
  next();
}
