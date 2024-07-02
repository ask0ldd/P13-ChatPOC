import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp, StompHeaders, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { IChatRoomHistory } from '../interfaces/IChatRoomHistory';
import { Observable } from 'rxjs';
import { TMessageType } from '../types/TMessageType';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseChatUrl = "http://localhost:8080/chat"
  private socket! : WebSocket
  private stompClient! : CompatClient
  private subs : StompSubscription[] = []

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  /*connect(callback : (message : IMessage) => void, privateChatroomId? : string){
    // Creates a new SockJS instance
    this.socket = new SockJS(this.baseChatUrl)

    // Initializes a STOMP client over the SockJS connection
    this.stompClient = Stomp.over(this.socket)

    // Connect to the WebSocket server
    this.stompClient.connect({}, (info : any) => {
      // Subscribes to the specified room (or general chat if no room ID is provided)
      if(!privateChatroomId) {
        this.subscribe(callback)
      }else{
        if(this.authService.getLoggedUserRole() == "ADMIN") this.sendMessage("JOIN", "An Admin is here to help you.", privateChatroomId)
        this.subscribe(callback, privateChatroomId)
      }
      console.log('Connected to WebSocket server : ' + info);
    }, (error : string) => {
      // Connection failed
      console.error('Failed to connect to WebSocket server', error);
    });
  }*/

  connectToPrivateRoom(callback : (message : IMessage) => void, privateChatroomId : string){
    this.socket = new SockJS(this.baseChatUrl)
    this.stompClient = Stomp.over(this.socket)
    this.stompClient.connect({}, 
      (info : any) => {
        if(this.authService.getLoggedUserRole() == "ADMIN") this.sendMessage("JOIN", "An Admin is here to help you.", privateChatroomId)
        this.subscribe(callback, privateChatroomId)
        console.log('Connected to WebSocket server : ' + info)
      }, 
      (error : string) => {
        // Connection failed
        console.error('Failed to connect to WebSocket server', error);
      })
  }

  connectToPublicRoom(callback : (message : IMessage) => void){
    this.socket = new SockJS(this.baseChatUrl)
    this.stompClient = Stomp.over(this.socket)
    this.stompClient.connect({}, 
      (info : any) => {
        this.subscribe(callback)
        console.log('Connected to WebSocket server : ' + info)
      }, 
      (error : string) => {
        // Connection failed
        console.error('Failed to connect to WebSocket server', error);
      })
  }

  subscribe(callback : messageCallbackType, chatroomId? : string) {
    if (this.stompClient) {
      const privateRoom = chatroomId == null ? '/queue/' + this.authService.getLoggedUserPrivateRoomId() : '/queue/' + chatroomId
      const sub = this.stompClient.subscribe(privateRoom, callback);
      this.subs.push(sub)
    }
  }

  sendMessage(messageType : TMessageType, message : string, privateRoomId? : string){ 
    if (this.stompClient) {
      // message is sent to the public endpoint by default
      let endpoint = messageType == "CHAT" ? '/ws/chat.sendMessage' : '/ws/chat.addUser'

      if(messageType == "CHAT") {
        // endpoint replaced by a private one if necessary
        if(privateRoomId) endpoint = '/ws/chat/sendMessage/' + privateRoomId
        this.stompClient.send(endpoint, {}, JSON.stringify({ content: message, sender: this.authService.getLoggedUserName(), type : "CHAT" }))
      }

      if(messageType == "JOIN") {
        // endpoint replaced by a private one if necessary
        if(privateRoomId) endpoint = '/ws/chat/addUser/' + privateRoomId
        const username = this.authService.getLoggedUserName()
        this.stompClient.send(endpoint, {}, JSON.stringify({ content: username, sender: username, type : "JOIN"}))
      }
    }
  }

  getHistory$(chatroomId : string) : Observable<IChatRoomHistory>{
    return this.httpClient.get<IChatRoomHistory>(`api/history/${chatroomId}`)
  }

  disconnect() {
    if (this.stompClient) {
      if(this.subs.length > 0) this.subs.forEach(sub => sub.unsubscribe())
      this.stompClient.disconnect()
    }
  }
}
