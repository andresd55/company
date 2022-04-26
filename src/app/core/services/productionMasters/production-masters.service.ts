import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductionMastersService {
  constructor(public http: HttpClient) { }

  getPlantPost(data: any): Observable<ResponseBase> {
    
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ProductionMasters}/Process/ProcessByUserPlantGetByAuthorizedUserId`,
      data
    );    
  }

  getProcessPost(data: any): Observable<ResponseBase> {
    
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ProductionMasters}/Process/ProcessByUserProcessGetByAuthorizedUserIdPlantId`,
      data
    );
  }

  getProcessAndOperatorIdPost(data: any): Observable<ResponseBase> {
    
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ProductionMasters}/Plant/PlantOperatorByProcessGetById`,
      data
    );    
  }  

  getProcessPaymentProductionPost(data: any): Observable<ResponseBase> {    
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ProductionMasters}/Process/ValidateProductionPayMethod`,
      data
    );             
  }
}
