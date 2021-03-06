import { GenericService } from './../../services/generic/generic.service';
import { AuthService } from './../../services/auth/auth.service';
import { Produto } from './../../models/produto';
import { ModalProdutoComponent } from './modal/modal-produto.component';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatPaginator } from '@angular/material';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ProdutoService } from '../../services/produto/produto.service';
import { Categoria } from '../../models/categoria';
import { ModalCategoriaComponent } from '../categoria/modal/modal-categoria.component';
import { ConfirmDialogService } from '../../components/common/confirm-dialog/confirm-dialog.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
/**
 * Teste para commit
 */

@Component({
	selector: 'app-produto',
	templateUrl: './produto.component.html',
	styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {
	[x:string]: any;

	
	@ViewChild(MatPaginator) paginator: MatPaginator;

	produto: Produto = new Produto();
	produtos: Produto[] = [];
	selectedProduto: Produto = new Produto;
	filteredProdutos: Produto[] = [];
	finalProdutos: Produto[] = [];

//contrói
	constructor(
		private produtoService: ProdutoService,
		private router: Router,
		private authService: AuthService,
		public dialog: MatDialog,
		private genericService: GenericService,
		public confirmDialogService: ConfirmDialogService,
		public snackBar: MatSnackBar
	) {
	}

	//@ViewChild('filter') filter: ElementRef;
//busca todos os cadastros
	ngOnInit() {
		this.findAll();
	}
//método para fazer busca dos produtso
	findAll() {
		this.produtoService.findAll().subscribe(produtos => {
			this.produtos = <Produto[]>produtos;
			this.filteredProdutos = Object.assign([], this.produtos);
			this.filterProduto("");
		}, err => {
			this.openSnackBar("Não foi possível carregar ", "OK");
		});
	}
//salvar
//	salvarProduto(produto: Produto) {
//		this.produtoService.save(produto).subscribe(result => {
//			console.log('Salvo com sucesso');
//			this.getAll();
//		}, err => {
//			console.log(err);
//		});
//	}
//cadastrar novo produto
	newProduto() {
		this.selectedProduto = new Produto();
	}
//filtros
	assignCopy() {
		this.filteredProdutos = Object.assign([], this.produto);
	}

	filterProduto(query) {
		if (!query) {
			this.filteredProdutos = Object.assign([], this.produtos);
		} else {
			this.filteredProdutos = Object.assign([], this.produtos).filter(
				produto => produto.name.toLowerCase().indexOf(query.toLowerCase()) > -1
			)
		}
		this.finalProdutos = this.filteredProdutos.slice(0, Math.min(this.filteredProdutos.length, this.paginator.pageSize));
	}
//abertura da janela abaixo para informação
	openDialog(produto: Produto): void {
		let dialogRef = this.dialog.open(ModalProdutoComponent, {
			data: produto
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.save(result);
			}
		});
	}
//deleta o produto mostrando um modal
	delete(produto: Produto) {
		this.confirmDialogService.confirm(
			'Confirmação',
			`Você tem ceteza que deseja remover ${produto.name}?`)
			.subscribe(res => {
				if (res) {
					this.produtoService.delete(produto.id).subscribe(produto => {
						this.openSnackBar("Removido com sucesso", "OK");
						this.findAll();
					}, err => {
						this.openSnackBar("Não foi possível remover ", "OK");
					})
				}
			});
	}
//salva o produto
	save(produto: Produto) {
		this.produtoService.save(produto).subscribe(resultado => {
			this.openSnackBar("Salvo com sucesso", "OK");
			this.findAll();
		}, err => {
			this.openSnackBar("Não foi possível salvar o produto", "OK");
		});
	}
//janelas abaino na tela para msg
	openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 10000,
		});
	}

	onPaginateChange(event):void{
		console.log('Paginator');
		let startIndex = event.pageIndex * event.pageSize;
		let endIndex = Math.min(startIndex + this.paginator.pageSize, this.filteredProdutos.length);
		this.finalProdutos = this.filteredProdutos.slice(startIndex, endIndex);
		
	 }
}