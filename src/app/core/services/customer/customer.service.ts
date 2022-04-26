import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(public http: HttpClient) { }

  getCustomerPost(data: any): Observable<ResponseBase> {
    // return this.http.post<ResponseBase>(
    //   `${environment.baseUrl.url}${environment.methods.Customer}/Customers/xd`,
    //   data
    // );    

    const responseBase1 = new ResponseBase();
    responseBase1.status = true;
    responseBase1.data = [
      {
        "customerId": 1,
        "customerName": "customer 1",
      },
      {
        "customerId": 2,
        "customerName": "customer 2",
      },
      {
        "customerId": 3,
        "customerName": "customer 3",
      }
    ];
    return of(responseBase1);

  }
}
