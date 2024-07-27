import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatRoomHistory } from '../interfaces/IChatRoomHistory';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {

  constructor(private httpClient: HttpClient) { }

  /**
   * @method fetchHistory$
   * @description Fetches the chat history for a specific chatroom.
   * @param {string} chatroomId - ID of the chatroom to fetch history for.
   * @returns {Observable<IChatRoomHistory>} Observable of the chat room history.
   */
  fetchHistory$(chatroomId : string) : Observable<IChatRoomHistory>{
      return this.httpClient.get<IChatRoomHistory>(`api/history/${chatroomId}`)
  }
}
