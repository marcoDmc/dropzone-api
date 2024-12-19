// @eslint-disable
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GuardGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    const verifyToken = this.isTokenExpired(token);

    if (verifyToken) return;

    return type === 'Bearer' ? token : undefined;
  }

  private isTokenExpired(token: string): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      jwt.verify(token, process.env.SECRET);
      return false;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return true;
      } else {
        throw err;
      }
    }
  }
}
