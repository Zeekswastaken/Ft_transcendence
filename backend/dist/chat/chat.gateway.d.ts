import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JWToken } from 'src/auth/jwt.service';
import { UserService } from 'src/user/user.service';
export declare class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatservice;
    private readonly jwt;
    private readonly userservice;
    constructor(chatservice: ChatService, jwt: JWToken, userservice: UserService);
    users: Map<string, string>;
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    getSocketId(client: Socket, obj: {
        token: string;
    }): Promise<void>;
    status(client: Socket, obj: {
        username: string;
    }): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    afterInit(server: Server): void;
    handleMessage(client: Socket, payload: {
        text: String;
        channelName: string;
    }): Promise<void>;
}
