import { Profile } from 'passport-42';
declare const fortytwo_Strategy_base: new (...args: any[]) => any;
export declare class fortytwo_Strategy extends fortytwo_Strategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
