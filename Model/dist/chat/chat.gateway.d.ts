import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JWToken } from 'src/auth/jwt.service';
export declare class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatservice;
    private readonly jwt;
    constructor(chatservice: ChatService, jwt: JWToken);
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    afterInit(server: Server): void;
    handleMessage(client: Socket, payload: {
        text: String;
        channelName: string;
    }): Promise<void>;
}
