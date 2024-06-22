import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private httpClient: HttpClient) { }

  get$(){
    return this.httpClient.get<any>(`api/queue`)
  }
}
