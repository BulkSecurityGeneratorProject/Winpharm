import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ILigneVente, LigneVente } from 'app/shared/model/ligne-vente.model';
import { LigneVenteService } from './ligne-vente.service';
import { IProduit } from 'app/shared/model/produit.model';
import { ProduitService } from 'app/entities/produit';
import { IEnteteVente } from 'app/shared/model/entete-vente.model';
import { EnteteVenteService } from 'app/entities/entete-vente';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { AccountService } from 'app/core';
import { ITEMS_PER_PAGE } from 'app/shared';
@Component({
  selector: 'jhi-ligne-vente-update',
  templateUrl: './ligne-vente-update.component.html'
})
export class LigneVenteUpdateComponent implements OnInit, OnDestroy {
  isSaving: boolean;
  currentAccount: any;
  // ligneVentes: ILigneVente[]=new LigneVente[10];
  ligneVentes: ILigneVente[];
  //tableau:any = new ligneVente3[3];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  produits: IProduit[];
  public count: number = 0;
  public ligneVente1: any;
  @Input() childMessage: any;
  enteteventes: IEnteteVente[];

  editForm = this.fb.group({
    id: [],
    ligneVenteQte: [null, [Validators.required]],
    ligneVenteTotalHT: [],
    ligneVenteTotalTTC: [],
    ligneVentePrixHT: [],
    ligneVentePrixTTC: [],
    ligneVenteDesignation: [],
    produit: [null, Validators.required],
    enteteVente: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected ligneVenteService: LigneVenteService,
    protected produitService: ProduitService,
    protected enteteVenteService: EnteteVenteService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected accountService: AccountService,
    protected router: Router,
    protected parseLinks: JhiParseLinks,
    protected eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    console.log('parent ' + this.childMessage.enteteVenteType);

    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ ligneVente }) => {
      this.updateForm(ligneVente);
    });
    this.produitService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IProduit[]>) => mayBeOk.ok),
        map((response: HttpResponse<IProduit[]>) => response.body)
      )
      .subscribe((res: IProduit[]) => (this.produits = res), (res: HttpErrorResponse) => this.onError(res.message));
    /* this.enteteVenteService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEnteteVente[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEnteteVente[]>) => response.body)
      )
      .subscribe((res: IEnteteVente[]) => (this.enteteventes = res), (res: HttpErrorResponse) => this.onError(res.message));
      this.loadAll();
      this.accountService.identity().then(account => {
        this.currentAccount = account;
      });
      this.registerChangeInLigneVentes();*/
  }

  updateForm(ligneVente: ILigneVente) {
    this.editForm.patchValue({
      id: ligneVente.id,
      ligneVenteQte: ligneVente.ligneVenteQte,
      ligneVenteTotalHT: ligneVente.ligneVenteTotalHT,
      ligneVenteTotalTTC: ligneVente.ligneVenteTotalTTC,
      ligneVentePrixHT: ligneVente.ligneVentePrixHT,
      ligneVentePrixTTC: ligneVente.ligneVentePrixTTC,
      ligneVenteDesignation: ligneVente.ligneVenteDesignation,
      produit: ligneVente.produit,
      enteteVente: ligneVente.enteteVente
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const ligneVente = this.createFromForm();
    console.log('ligneVente.id ' + ligneVente.id);
    console.log('ligneVente.ligneVenteQte ' + ligneVente.ligneVenteQte);
    console.log('ligneVente.produit ' + ligneVente.produit.id);
    console.log('ligneVente.produit.designiation ' + ligneVente.produit.produitLibelle);
    if (this.ligneVentes == null) {
      this.ligneVentes = [
        {
          id: ligneVente.id,
          ligneVenteDesignation: 'string',
          ligneVentePrixHT: 0,
          ligneVentePrixTTC: 0,
          ligneVenteQte: ligneVente.ligneVenteQte,
          ligneVenteTotalHT: 0,
          ligneVenteTotalTTC: 0,
          produit: ligneVente.produit,
          enteteVente: this.childMessage
        }
      ];
    } else {
      this.ligneVentes.push({
        id: ligneVente.id,
        ligneVenteDesignation: 'string',
        ligneVentePrixHT: 0,
        ligneVentePrixTTC: 0,
        ligneVenteQte: ligneVente.ligneVenteQte,
        ligneVenteTotalHT: 0,
        ligneVenteTotalTTC: 0,
        produit: ligneVente.produit,
        enteteVente: this.childMessage
      });
    }
    //   console.log("JSON.stringify(ligneVentes)"+JSON.stringify(this.ligneVente1));

    this.loadAll();
  }
  save2() {
    this.subscribeToSaveResponse(this.enteteVenteService.create(this.childMessage));
    for (var i = 0; i < this.ligneVentes.length; i++) {
      this.subscribeToSaveResponse(this.ligneVenteService.create(this.ligneVentes[i]));
    }
  }
  private createFromForm(): ILigneVente {
    const entity = {
      ...new LigneVente(),
      id: this.editForm.get(['id']).value,
      ligneVenteQte: this.editForm.get(['ligneVenteQte']).value,
      ligneVenteTotalHT: this.editForm.get(['ligneVenteTotalHT']).value,
      ligneVenteTotalTTC: this.editForm.get(['ligneVenteTotalTTC']).value,
      ligneVentePrixHT: this.editForm.get(['ligneVentePrixHT']).value,
      ligneVentePrixTTC: this.editForm.get(['ligneVentePrixTTC']).value,
      ligneVenteDesignation: this.editForm.get(['ligneVenteDesignation']).value,
      produit: this.editForm.get(['produit']).value,
      enteteVente: this.editForm.get(['enteteVente']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILigneVente>>) {
    result.subscribe((res: HttpResponse<ILigneVente>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackProduitById(index: number, item: IProduit) {
    return item.id;
  }

  trackEnteteVenteById(index: number, item: IEnteteVente) {
    return item.id;
  }

  loadAll() {
    this.ligneVenteService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<ILigneVente[]>) => this.paginateLigneVentes(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.ngOnInit();
  }
  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/ligne-vente'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.router.navigate([
      '/ligne-vente',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ILigneVente) {
    return item.id;
  }

  registerChangeInLigneVentes() {
    this.eventSubscriber = this.eventManager.subscribe('ligneVenteListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateLigneVentes(data: ILigneVente[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    //this.ligneVentes = data;
  }
}
