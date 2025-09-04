import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
  };
}

@Injectable()
export class SimpleAuthMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    console.log('🔐 Middleware: Checking if user is logged in...');

    // Mock check - pretend we're checking for a token
    const hasToken = req.headers.authorization;

    if (!hasToken) {
      console.log('❌ Middleware: No token found! Access denied.');
      return res.status(401).json({ message: 'Please login first!' });
    }

    console.log('✅ Middleware: Token found! User is authenticated.');
    // Add fake user info to request
    req.user = { id: 1, name: 'John Doe' };

    next(); // Continue to the actual route
  }
}
