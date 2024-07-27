import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
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

  // assisted customers
  // conversations
  // private activeRoom : string
  // private openedRooms : string[]


  /**
   * @constructor
   * @param {HttpClient} httpClient - HTTP client for making API requests.
   * @param {AuthService} authService - Authentication service for user information.
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  /**
   * @method initialize
   * @description Initializes the WebSocket connection and STOMP client.
   */
  initialize(){
    this.socket = new SockJS(this.baseChatUrl)
    this.stompClient = Stomp.over(this.socket)
  }

  /**
   * @method connectToChatroom
   * @description Connects to a specific chatroom.
   * @param {function} callback - Callback function to handle incoming messages.
   * @param {string} privateChatroomId - ID of the private chatroom to connect to.
   */
  connectToChatroom(callback : (message : IMessage) => void, privateChatroomId : string){
    this.initialize()
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

  /**
   * @method subscribe
   * @description Subscribes to a chatroom.
   * @param {function} callback - Callback function to handle incoming messages.
   * @param {string} chatroomId - ID of the chatroom to subscribe to.
   */
  subscribe(callback : messageCallbackType, chatroomId : string) {
    if (this.stompClient) {
      const privateRoom = chatroomId == null ? '/queue/' + this.authService.getLoggedUserPrivateRoomId() : '/queue/' + chatroomId
      const sub = this.stompClient.subscribe(privateRoom, callback);
      this.subs.push(sub)
    }
  }

  /**
   * @method sendMessage
   * @description Sends a message to a chatroom.
   * @param {TMessageType} messageType - Type of the message (CHAT or JOIN).
   * @param {string} message - Content of the message.
   * @param {string} privateRoomId - ID of the private room to send the message to.
   */
  sendMessage(messageType : TMessageType, message : string, privateRoomId : string){ 
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

  /**
   * @method fetchHistory$
   * @description Fetches the chat history for a specific chatroom.
   * @param {string} chatroomId - ID of the chatroom to fetch history for.
   * @returns {Observable<IChatRoomHistory>} Observable of the chat room history.
   */
  fetchHistory$(chatroomId : string) : Observable<IChatRoomHistory>{
    return this.httpClient.get<IChatRoomHistory>(`api/history/${chatroomId}`)
  }

  /**
   * @method disconnect
   * @description Disconnects from all subscriptions and the STOMP client.
   */
  disconnect() {
    if (this.stompClient) {
      if(this.subs.length > 0) this.subs.forEach(sub => sub.unsubscribe())
      this.stompClient.disconnect()
    }
  }
}
