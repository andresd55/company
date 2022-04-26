import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterProductService {

  constructor(public http: HttpClient) { }

  getCutPost(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Cut/CutActiveGet`,
      data
    );
  }
}
