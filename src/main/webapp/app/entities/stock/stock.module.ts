import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { WinpharmSharedModule } from 'app/shared';
import {
  StockComponent,
  StockDetailComponent,
  StockUpdateComponent,
  StockDeletePopupComponent,
  StockDeleteDialogComponent,
  stockRoute,
  stockPopupRoute
} from './';

const ENTITY_STATES = [...stockRoute, ...stockPopupRoute];

@NgModule({
  imports: [WinpharmSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [StockComponent, StockDetailComponent, StockUpdateComponent, StockDeleteDialogComponent, StockDeletePopupComponent],
  entryComponents: [StockComponent, StockUpdateComponent, StockDeleteDialogComponent, StockDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WinpharmStockModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
