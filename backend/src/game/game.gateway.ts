// // src/websocket-gateway/websocket-gateway.gateway.ts
// import { Inject, Injectable } from '@nestjs/common';
// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { JWToken } from 'src/auth/jwt.service';
// import { ChatService } from 'src/chat/chat.service';
// import { User } from 'src/database/user.entity';
// import { UserService } from 'src/user/user.service';
// @Injectable()
// @WebSocketGateway()
// export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;
//   constructor (private readonly jwt:JWToken,private readonly userservice:UserService){}
//   ///@SubscribeMessage('joinDuo')
//   async handleConnection(client: Socket) {
//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJrYXJpbSIsImdlbmRlciI6bnVsbCwiYmlydGhEYXkiOm51bGwsImF2YXRhcl91cmwiOiJodHRwczovL2VuY3J5cHRlZC10Ym4wLmdzdGF0aWMuY29tL2ltYWdlcz9xPXRibjpBTmQ5R2NSWnF0Z1oyZVcyRjJIdnZGT3E5UnMwa1ZXaVdKTDdwUWJBNWcmdXNxcD1DQVUiLCJpYXQiOjE2OTMxNDMyNjUsImV4cCI6MTY5MzIyOTY2NX0.HhHR9Sc8wLBd1mlpnwPR_C8EJ2Ev2azFW737m5vZhKY";
//     if (await this.jwt.verify(token))
//     {
//       const user = await this.jwt.decoded(token);
//       user.gameSocket = client.id;
//       await this.userservice.update(user,user.id as number);
//       const current = await this.userservice.findByName(user.username);
//       console.log("USER = "+ JSON.stringify(current));
//       //const rooms  = await this.chatservice.getAllRooms(user.id as number);
//       //rooms.forEach(room=>{client.join(room)})
//       console.log(`Client connected: ${client.id}`);
//     }
//     //console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
    
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   afterInit(server: Server) {
//     console.log('WebSocket gateway initialized');
//   }

//   @SubscribeMessage('Duo')
//   async handleMessage(client: Socket, payload) {
//     console.log(`message from client id:${client.id} `+ payload)
//     client.emit("send","Hello from Server")
//   }
// }