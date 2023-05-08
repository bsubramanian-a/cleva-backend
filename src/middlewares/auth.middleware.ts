import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    // Verify the token and attach the payload to the request object
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      req.user = payload;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
