import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { IChatMessageType } from '../interfaces/IChatMessageType';
import { IUser } from '../interfaces/IUser';
import { IChatRoomHistory } from '../interfaces/IChatRoomHistory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseChatUrl = "http://localhost:8080/chat"
  private socket! : WebSocket
  private stompClient! : CompatClient
  private subs : StompSubscription[] = []

  /*assignedCustomer : IUser = {
    username: "",
    role: "CUSTOMER",
    chatroomId: "",
    id: 0,
    email: ""
  }*/

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  /**
   * Establishes a WebSocket connection to the chat server and sets up a STOMP client.
   * 
   * @param {function} callback - A function to be called when a message is received.
   *                              It takes an IMessage object as its parameter.
   * @param {string} [privateChatroomId] - Optional. The ID of a private chatroom to join.
   *                                       If not provided, it defaults to an empty string.
   * @throws {Error} Throws an error if the connection fails.
   * */
  connect(callback : (message : IMessage) => void, privateChatroomId? : string){
    // Creates a new SockJS instance
    this.socket = new SockJS(this.baseChatUrl)

    // Initializes a STOMP client over the SockJS connection
    this.stompClient = Stomp.over(this.socket)

    // Connect to the WebSocket server
    this.stompClient.connect({}, (info : any) => {
      // Sends a message indicating the user is joining a private room
      // this.sendMessage_UserJoiningPrivateRoom()
      this.sendMessage({isMessagePrivate : true, type : "JOIN"}, "", this.authService.getLoggedUserPrivateRoomId())
      //const room = privateChatroomId ? privateChatroomId : ""
      // Subscribes to the specified room (or general chat if no room ID is provided)
      if(!privateChatroomId) {
        this.subscribe(callback)
      }else{
        this.subscribe(callback, privateChatroomId)
      }
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

  subscribe(callback : messageCallbackType, chatroomId? : string) {
    if (this.stompClient) {
      // const publicTopic = '/topic/public'
      const privateRoom = chatroomId == null ? '/queue/' + this.authService.getLoggedUserPrivateRoomId() : '/queue/' + chatroomId
      const sub = this.stompClient.subscribe(privateRoom, callback);
      this.subs.push(sub)
    }
  }

  // !!! to fix : privateroomid should be retrieved from selected user if admin or logged user if customer and not as a param
  sendMessage({isMessagePrivate, type} : IChatMessageType, message? : string, privateRoomId? : string){
    if (this.stompClient) {
      if(isMessagePrivate && !privateRoomId) return

      // message is sent to the public endpoint by default
      let endpoint = type == "CHAT" ? '/ws/chat.sendMessage' : '/ws/chat.addUser'

      // endpoint replaced by a private one if necessary
      if(isMessagePrivate && type == "CHAT") endpoint = '/ws/chat/sendMessage/' + privateRoomId
      if(isMessagePrivate && type == "JOIN") endpoint = '/ws/chat/addUser/' + this.authService.getLoggedUserPrivateRoomId()

      if(type == "CHAT") {
        this.stompClient.send(endpoint, {}, JSON.stringify({ content: message, sender: this.authService.getLoggedUserName(), type : "CHAT" }))
      }

      if(type == "JOIN") {
        const user = this.authService.getLoggedUserName()
        this.stompClient.send(endpoint, {}, JSON.stringify({ content: user, sender: user, type : "JOIN"}))
      }
    }
  }

  getHistory$(chatroomId : string) : Observable<IChatRoomHistory>{
    return this.httpClient.get<IChatRoomHistory>(`api/history/${chatroomId}`)
  }

}
