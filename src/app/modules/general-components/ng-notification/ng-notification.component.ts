import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {Client} from "stompjs";
import Swal from "sweetalert2";
import {fuctionObtenerIdUsuario} from '../../../utils/TokenUtils'

@Component({
	selector: 'app-ng-notification',
	templateUrl: './ng-notification.component.html',
	styleUrls: ['./ng-notification.component.sass']
})
export class NgNotificationComponent implements OnInit {


	constructor(private stompService: SocketService) {
	}

	ngOnInit(): void {
		const client: Client = this.stompService.getClient();

	}

	private initNotificationPersonal(client: Client) {
		let _this = this
		client.connect({}, function (frame) {
			const idUsuario = fuctionObtenerIdUsuario()
			client.subscribe(`/topic/${idUsuario}`, (message) => {
				console.log(message)
				Swal.fire({
					title: 'Notificacion del servidor',
					text: JSON.stringify(message),

				})
			})
		})
	}

}
