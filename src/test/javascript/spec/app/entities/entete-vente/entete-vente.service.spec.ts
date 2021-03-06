/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { EnteteVenteService } from 'app/entities/entete-vente/entete-vente.service';
import { IEnteteVente, EnteteVente } from 'app/shared/model/entete-vente.model';

describe('Service Tests', () => {
  describe('EnteteVente Service', () => {
    let injector: TestBed;
    let service: EnteteVenteService;
    let httpMock: HttpTestingController;
    let elemDefault: IEnteteVente;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(EnteteVenteService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new EnteteVente(0, 0, 0, 'AAAA', currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            enteteVenteDateCreation: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a EnteteVente', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            enteteVenteDateCreation: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            enteteVenteDateCreation: currentDate
          },
          returnedFromService
        );
        service
          .create(new EnteteVente(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a EnteteVente', async () => {
        const returnedFromService = Object.assign(
          {
            enteteVenteType: 'BBBBBB',
            enteteVenteTotalHT: 1,
            enteteVenteTotalTTC: 1,
            enteteVenteDateCreation: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            enteteVenteDateCreation: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of EnteteVente', async () => {
        const returnedFromService = Object.assign(
          {
            enteteVenteType: 'BBBBBB',
            enteteVenteTotalHT: 1,
            enteteVenteTotalTTC: 1,
            enteteVenteDateCreation: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            enteteVenteDateCreation: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a EnteteVente', async () => {
        const rxPromise = service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
