import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {Client} from "stompjs";
import Swal from "sweetalert2";
import {fuctionObtenerIdUsuario} from '../../../utils/TokenUtils'
import {NotificacionService} from "../../../services/notificacion.service";
import * as moment from "moment";

interface Notificacion {

	idNotificacion: number;
	leida: boolean;
	url: string;
	titulo: string;
	mensaje: string;
	fechaAlta: string;
	redirecion: boolean

}

@Component({
	selector: 'app-ng-notification',
	templateUrl: './ng-notification.component.html',
	styleUrls: ['./ng-notification.component.sass']
})
export class NgNotificationComponent implements OnInit {
	notificaciones: Notificacion[] = []

	constructor(private stompService: SocketService, private notificacionService: NotificacionService) {

	}

	ngOnInit(): void {
		Notification.requestPermission().then(res=>{
			if(Notification.permission==='granted' || Notification.permission==='default'){
				const client: Client = this.stompService.getClient();
				this.initNotificationPersonal(client);
			}
		})
		this.cargarNotificaciones();
	}

	cargarNotificaciones() {
		const idUsuario = fuctionObtenerIdUsuario()
		this.notificacionService.obtenerNotificaciones(idUsuario).subscribe((response: Notificacion[]) => {
			this.notificaciones = response;
		}, error => console.log(error.message))
	}

	private initNotificationPersonal(client: Client) {
		let _this = this
		client.connect({}, function (frame) {
			const idUsuario = fuctionObtenerIdUsuario()
			client.subscribe(`/topic/notificacion_personal/${idUsuario}`, (message) => {
				console.log(message)
				const notificacion: Notificacion = JSON.parse(message.body);
				_this.notificaciones.unshift(notificacion);
				const not = new Notification(notificacion.titulo , {body :notificacion.mensaje})

			})
		})
	}

	diferenciaTiempo(fecha: string) {
		const fechaActual = moment(new Date());
		const fechaNotificacion = moment(fecha)
		let mensaje = 'Hace '
		const anio = fechaActual.diff(fechaNotificacion, 'years');
		if (anio > 0) {
			mensaje += anio == 1 ? `${anio} años` : `un año`;
		} else {
			const meses = fechaActual.diff(fechaNotificacion, 'months');
			if (meses > 0) {
				mensaje += meses > 1 ? `${meses} meses` : 'un mes';
			} else {
				const semanas = fechaActual.diff(fechaNotificacion, 'weeks');
				if (semanas > 0) {
					mensaje += semanas > 1 ? `${semanas} semanas` : 'una semana';
				} else {
					const dias = fechaActual.diff(fechaNotificacion, 'days');
					if (dias > 0) {
						mensaje += dias > 1 ? `${dias} dias ` : 'un día'
					} else {
						const horas = fechaActual.diff(fechaNotificacion, 'hours')
						if (horas > 0) {
							mensaje += horas > 1 ? `${horas} horas` : ' una hora'
						} else {
							const minutos = fechaActual.diff(fechaNotificacion, 'minutes')
							if (minutos > 0) {
								mensaje += minutos > 1 ? `${minutos} minutos` : 'un minuto'
							} else {
								mensaje += 'momentos'
							}
						}

					}
				}
			}
		}
		return mensaje;
	}
}
