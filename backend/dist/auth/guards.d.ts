import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JWToken } from "./jwt.service";
export declare class TokenGuard implements CanActivate {
    private readonly jwtToken;
    constructor(jwtToken: JWToken);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
