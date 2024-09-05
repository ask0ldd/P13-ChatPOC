import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompatClient, IMessage, Stomp, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { IChatRoomHistory } from '../interfaces/IChatRoomHistory';
import { Observable } from 'rxjs';
import { TMessageType } from '../types/TMessageType';
import { IUser } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseChatUrl = "http://localhost:8080/chat"
  private socket! : WebSocket
  private stompClient! : CompatClient
  private subs : StompSubscription[] = []

  private activeConversationsSubs : Set<{chatroomName : string, sub : StompSubscription}> = new Set<{chatroomName : string, sub : StompSubscription}>()

  /**
   * @constructor
   * @param {HttpClient} httpClient - HTTP client for making API requests.
   * @param {AuthService} authService - Authentication service for user information.
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) { 
    // this.initializeClient()
  }

  /**
   * Initializes the STOMP client and subscribes to a private chatroom.
   * @param {function} callback - Callback function to handle incoming messages.
   * @param {string} privateChatroomId - ID of the private chatroom to subscribe to.
   */
  initChatClient(callback : (message : IMessage) => void, privateChatroomId : string){
    this.socket = new SockJS(this.baseChatUrl)
    this.stompClient = Stomp.over(this.socket)

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame)
      this.subscribe(callback, privateChatroomId)
    }

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
    }

    this.stompClient.activate()
  }

  /**
   * Initializes a new conversation and subscribes to the chatroom.
   * Sends a JOIN message to notify that an admin has joined.
   * @param {function} callback - Callback function to handle incoming messages.
   * @param {IUser} customer - User object representing the customer in the conversation.
   */
  initNewConversation(callback : (message : IMessage) => void, customer : IUser){
    if (this.stompClient) {
      this.sendMessage("JOIN", "An admin is here to help you.", customer.chatroomName)
      const sub = this.subscribe(callback, customer.chatroomName) // array should be [{chatroomId : '', sub : sub}, ...]
      // used later to unsub when closing a conversation
      if(sub != null) this.activeConversationsSubs.add({chatroomName: customer.chatroomName, sub: sub})
    } else {
      console.error("StompClient should be initialized first.")
    }
  }

  /**
   * @method subscribe
   * @description Subscribes to a chatroom.
   * @param {function} callback - Callback function to handle incoming messages.
   * @param {string} chatroomName - ID of the chatroom to subscribe to.
   */
  subscribe(callback : messageCallbackType, chatroomName : string) : StompSubscription | void {
    if (this.stompClient) {
      const privateRoom = chatroomName == null ? '/queue/' + this.authService.getLoggedUserPrivateRoomName() : '/queue/' + chatroomName
      const sub = this.stompClient.subscribe(privateRoom, callback);
      this.subs.push(sub)
      return sub
    }
  }

  /**
   * @method sendMessage
   * @description Sends a message to a chatroom.
   * @param {TMessageType} messageType - Type of the message (CHAT or JOIN).
   * @param {string} message - Content of the message.
   * @param {string} privateRoomName - ID of the private room to send the message to.
   */
  sendMessage(messageType : TMessageType, message : string, privateRoomName : string){ 
    if (this.stompClient) {
      // message is sent to the public endpoint by default
      let endpoint = messageType == "CHAT" ? '/ws/chat.sendMessage' : '/ws/chat.addUser'

      if(messageType == "CHAT") {
        // endpoint replaced by a private one if necessary
        if(privateRoomName) endpoint = '/ws/chat/sendMessage/' + privateRoomName
        this.stompClient.send(endpoint, {}, JSON.stringify({ content: message, sender: this.authService.getLoggedUserName(), type : "CHAT" }))
      }

      if(messageType == "JOIN") {
        // endpoint replaced by a private one if necessary
        if(privateRoomName) endpoint = '/ws/chat/addUser/' + privateRoomName
        const username = this.authService.getLoggedUserName()
        this.stompClient.send(endpoint, {}, JSON.stringify({ content: username, sender: username, type : "JOIN"}))
      }
    } else {
      console.error("StompClient should be initialized first.")
    }
  }

  /**
   * @method fetchHistory$
   * @description Fetches the chat history for a specific chatroom.
   * @param {string} chatroomName - ID of the chatroom to fetch history for.
   * @returns {Observable<IChatRoomHistory>} Observable of the chat room history.
   */
  fetchHistory$(chatroomName : string) : Observable<IChatRoomHistory>{
    return this.httpClient.get<IChatRoomHistory>(`api/history/${chatroomName}`)
  }

  /**
   * Closes an active conversation by unsubscribing from the chatroom.
   * @param {IUser} customer - User object representing the customer whose conversation is to be closed.
   */
  closeConversation(customer : IUser){
    const foundConversation = Array.from(this.activeConversationsSubs).find(item => item.chatroomName == customer.chatroomName)
    if(foundConversation){
      foundConversation?.sub.unsubscribe()
      this.activeConversationsSubs.delete(foundConversation)
    }
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
