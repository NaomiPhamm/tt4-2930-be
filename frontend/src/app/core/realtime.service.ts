import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket: Socket | null = null;

  connect(onTaskCreated: () => void):void{
    if(this.socket?.connected){
      return;
    };

    if(this.socket){
      this.socket.connect();
    };

    this.socket = io(environment.apiUrl, {
      transports: ['websocket'],
    });

    this.socket.on("task:created", onTaskCreated);

  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket?.off("task:created");
  }
}
