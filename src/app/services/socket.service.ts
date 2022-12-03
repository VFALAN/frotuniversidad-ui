import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
	docket = new SockJS('http://localhost:8084/ws')
	stompClient = Stomp.over(this.docket);

	getClient(){
		return Stomp.over(this.docket);
	}
  constructor() { }
}
