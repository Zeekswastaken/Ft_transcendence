import { AuthService } from "./auth.service";
import { User } from "src/database/user.entity";
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authservice;
    constructor(authservice: AuthService);
    validate(username: String, password: String): Promise<User | null>;
}
export {};
