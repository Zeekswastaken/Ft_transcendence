export declare class UserDto {
    username: String;
    password: String;
    repassword: String;
    avatar_url: String;
    gender: String;
    birthDay: Date;
    constructor();
}
export declare class UserDto2 {
    username: String;
    password: String;
    avatar_URL: String;
    gender: String;
    birthDay: Date;
    constructor();
}
export declare class jwtDTO {
    username: String;
    avatar_URL: String;
    gender: String;
    birthDay: Date;
}
export declare class MoreInfos {
    id: number;
    avatar_URL: String;
    gender: String;
    birthDay: Date;
    cookie: String;
    constructor();
}
export declare class TO_update {
    avatar_URL: String;
    gender: String;
    birthDay: Date;
    constructor();
}
export declare class update {
    username: String;
    password: String;
    Bio: String;
    privacy: Boolean;
    constructor();
}
export declare class tokenDto {
    token: String;
}
