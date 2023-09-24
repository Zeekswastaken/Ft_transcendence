import { Body, CanActivate, ExecutionContext, Injectable, Res } from "@nestjs/common";
import { JWToken } from "./jwt.service";
import { Response } from 'express';
import { tokenDto } from "src/Dto/use.Dto";


interface CustomRequest extends Request {
  user?: any;
}
@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly jwtToken: JWToken) {}

  async canActivate(context: ExecutionContext):Promise< boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();
    const token = req.body.token;
    if (token) {
      if (await this.jwtToken.verify(token)) {
        req.user = { status: 'authorized', message: 'token valid',token:token };
        return true;
      }
    }

    req.user = { status: 'unauthorized', message: 'token isn\'t valid',token:null };
      return true;
  }
}
