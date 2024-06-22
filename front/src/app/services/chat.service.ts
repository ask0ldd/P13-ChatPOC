import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseChatUrl = "http://localhost:8080/chat"
  private socket! : WebSocket
  private stompClient! : CompatClient
  private subs : StompSubscription[] = []

  constructor(private http: HttpClient, private authService: AuthService) { }

  connect(callback : (message : IMessage) => void){
    // Create a SockJS instance
    // this.socket = new SockJS(this.chatUrl + '/' + this.authService.getUserPrivateRoomId())
    this.socket = new SockJS(this.baseChatUrl)

    // Use STOMP over the SockJS instance
    this.stompClient = Stomp.over(this.socket)

    // Connect to the server
    this.stompClient.connect({}, (info : any) => {
      // Connection successful, you can subscribe to topics here
      this.addUserToPrivateRoom()
      this.subscribe("", callback)
      console.log('Connected to WebSocket server : ' + info);
    }, (error : string) => {
      // Connection failed
      console.error('Failed to connect to WebSocket server', error);
    });
  }

  disconnect() {
    if (this.stompClient) {
      if(this.subs.length > 0) this.subs.forEach(sub => sub.unsubscribe())
      this.stompClient.disconnect();
    }
  }

  subscribe(topic : string, callback : messageCallbackType) {
    if (this.stompClient) {
      // const publicTopic = '/topic/public'
      const privateRoom = '/queue/' + this.authService.getUserPrivateRoomId()
      const sub = this.stompClient.subscribe(privateRoom, callback);
      this.subs.push(sub)
    }
  }

  sendPublicMessage(message : string) {
    if (this.stompClient) {
      const publicTopic = '/ws/chat.sendMessage'
      this.stompClient.send(publicTopic, {}, JSON.stringify({ content: message, sender: this.authService.getUsername(), type : "CHAT"}));
    }
  }

  sendPrivateMessage(roomId : string, message : string){
    if (this.stompClient) {
      const privateRoomEndpoint = '/ws/chat/sendMessage/' + roomId
      this.stompClient.send(privateRoomEndpoint, {}, JSON.stringify({ content: message, sender: this.authService.getUsername(), type : "CHAT"}));
    }
  }

  addUser() {
    if (this.stompClient) {
      const user = this.authService.getUsername()
      this.stompClient.send("/ws/chat.addUser", {}, JSON.stringify({ content: user, sender: user, type : "JOIN"}));
    }
  }

  addUserToPrivateRoom() {
    if (this.stompClient) {
      const user = this.authService.getUsername()
      this.stompClient.send('/ws/chat/addUser/' + this.authService.getUserPrivateRoomId(), {}, JSON.stringify({ content: user, sender: user, type : "JOIN"}));
    }
  }
}
