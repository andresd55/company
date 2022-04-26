import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WmsService {

  constructor(public http: HttpClient) { }

  getCustomerProcessId(data: any): Observable<ResponseBase> {

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/Customer/CustomerGetByProcessId`,
      data
    );
  }

  getProductionOrderPost(data: any): Observable<ResponseBase> {

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/ProductionOrder/ProductionOrderGetByFiltered`,
      data
    );
  }

  getOrderDetailPost(data: any): Observable<ResponseBase> {

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/OrderDetail/OrderDetailGet`,
      data
    );
  }

  getTotalizedOrderStatusPost(data: any): Observable<ResponseBase> {

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/ProductionOrder/ProductionOrderTotalizedGetByState`,
      data
    );
  }

  updateStatePost(data: any): Observable<ResponseBase> {

    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/OrderRoute/UpdateOrderRoute`,
      data
    );
  }

  getCheckListQuestionsPost(data: any): Observable<ResponseBase> {

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/ChecklistFormQuestions/ChecklistFormQuestionsByProcessIdGet`,
      data
    );
  }

  insertCheckListQuestionsPost(data: any): Observable<ResponseBase> {

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/AuditResultChecklist/CreateAuditResultChecklist`,
      data
    );
  }

  insertOrderRoutePost(data: any): Observable<ResponseBase> {

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Wms}/OrderRoute/CreateOrderRouteOperator`,
      data
    );
  }
}
