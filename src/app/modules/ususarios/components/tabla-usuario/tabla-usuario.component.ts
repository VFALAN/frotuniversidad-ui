import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from "../../services/usuario.service";
import {MatTableDataSource} from "@angular/material/table";
import {UsuarioTableDTO} from "../../model/usuario-table-dto";
import {HttpErrorResponse} from "@angular/common/http";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
	selector: 'app-tabla-usuario',
	templateUrl: './tabla-usuario.component.html',
	styleUrls: ['./tabla-usuario.component.sass']
})
export class TablaUsuarioComponent implements OnInit, AfterViewInit {

	@ViewChild(MatPaginator, {static: false})
	paginator!: MatPaginator;
	@ViewChild(MatSort)
	sort!: MatSort;
	idFilter: string = ''
	isLoading: boolean = false;
	length = 0;
	pageSize: number = 10;
	currentPage: number = 0;
	pageSizeOptions: number[] = [5, 10, 15, 20, 50, 100];
	displayColumns: string[] = ['nombre',
		'aPaterno',
		'aMaterno',
		'idEstatus',
		'indActivo',
		'idPerfil',
		'folio',
		'asentamiento',
		'codigoPostal',
		'municipio',
		'estado',
		'opciones']
	dataSource: MatTableDataSource<UsuarioTableDTO> = new MatTableDataSource();


	constructor(private usuarioService: UsuarioService,
				private fb: FormBuilder) {
	}

	formFilters !: FormGroup;

	ngOnInit(): void {
		this.initForm();
		this.loadData();
	}

	initForm(): void {
		this.formFilters = this.fb.group({
			nombre: [null],
			paterno: [null],
			materno: [null],
			estatus: [null],
			perfil: [null],
			estado: [null],
			asentamiento: [null],
			codigoPostal: [null],
			municipio: [null],
			folio: [null]
		})
	}

	listWhitFitlters(): void {
		const filters = this.formFilters.getRawValue();
		const order = this.sort.direction;
		const column = this.sort.active;
		console.log(filters, order, column)
	}

	disableAndEnableUsuario(usuario: any) {
		console.log(usuario);
		this.isLoading = true
		this.usuarioService.disableOrEnable(usuario.idUsuario).subscribe(() => {

			}, error => {
				Swal.fire({title: 'ERROR', icon: 'error', text: error.message});
			}, () => {
				this.isLoading = false
			}
		)
	}

	loadData() {
		this.isLoading = true
		const data = JSON.stringify(this.formFilters.getRawValue());
		const order = this.sort?.direction != undefined ? this.sort.direction : '';
		const column = order != '' ? this.sort.active : ''
		this.usuarioService.buscarPorFiltros(this.currentPage, this.pageSize, column, order, data).subscribe(response => {
			this.dataSource.data = response.data
			this.length = response.totalRecords;
		}, (error: HttpErrorResponse) => {
			console.log(error.message);
		}, () => {
			this.isLoading = false
		})
	}

	pageChenged(event: PageEvent) {
		this.currentPage = event.pageIndex;
		this.pageSize = event.pageSize;
		this.loadData();
	}

	sortEvent(event: any) {
		this.loadData();
	}

	ngAfterViewInit(): void {
		// this.dataSource.paginator = this.paginator
	}

	cleanFilter(formControl: string): void {
		this.formFilters.controls[formControl].setValue(null);
		this.loadData();
	}

	onFilterChange(): void {
		this.loadData()
	}

	eliminarUsuario(usuario: any) {
		Swal.fire({
			title: 'Confirmar',
			icon: "warning",
			text: `Desea eliminar al Usuario: ${usuario.folio}`,
			confirmButtonText: 'Si, eliminar',
			showCancelButton: true,
			cancelButtonText: 'Cancelar'
		}).then((res) => {
				if (res.isConfirmed) {
					this.isLoading = true;
					this.usuarioService.delete(usuario.idUsuario).subscribe((response: any) => {
						Swal.fire({
							title: 'USUARIO ELIMINADO',
							text: 'El Usuario Fue Eliminado',
							icon: 'success'
						}).then(() => this.loadData())
					}, (error: HttpErrorResponse) => {
						console.log('error', error.message);
					}, () => {
						this.isLoading = false;
					})
				}
			}
		)
	}

}
