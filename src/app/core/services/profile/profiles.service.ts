import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserType } from 'src/app/shared/constant/userType';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(private storageService: StorageService, public http: HttpClient) { }

  validateUserType(): Boolean {
    if (this.storageService.getUserType() == UserType.customer) {
      return true;
    } else if (this.storageService.getUserType() == UserType.internal) {
      return false;
    } else {
      return false;
    }
  }

  validateRolBuilderContrator(): Boolean {
    if(this.validateUserType()) {
      if(this.storageService.getProfiles().role == 10) {
        return true;
      }
    }
    return false;
  }

  validateRolBuilderSalesExecutive(): Boolean {
    if(!this.validateUserType()) {
      return this.storageService.getProfiles().role == 7;
    } else {
      return true;
    }
    
  }

  loginB2bGetFinotex(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      "https://finotexapishareddev.azurewebsites.net/api/V1/Profile/LoginB2bGet",
      data
    );
  }
}
