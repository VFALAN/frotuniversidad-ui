import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from "../../services/usuario.service";
import {MatTableDataSource} from "@angular/material/table";
import {UsuarioTableDTO} from "../../model/usuario-table-dto";
import {HttpErrorResponse} from "@angular/common/http";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

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
	displayColumns: string[] = ['id', 'nombre', 'aPaterno', 'aMaterno', 'idEstatus', 'idPerfil', 'folio', 'opciones']
	dataSource: MatTableDataSource<UsuarioTableDTO> = new MatTableDataSource();


	constructor(private usuarioService: UsuarioService) {
	}

	ngOnInit(): void {
		this.loadData();
	}

	loadData() {
		this.isLoading = true
		this.usuarioService.list(this.currentPage, this.pageSize).subscribe(response => {
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
		console.log(event)
	}

	ngAfterViewInit(): void {
		// this.dataSource.paginator = this.paginator
	}

}
