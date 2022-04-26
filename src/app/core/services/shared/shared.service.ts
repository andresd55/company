import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { RoleProfileInternal } from 'src/app/shared/constant/roleProfile';
import { Router } from '@angular/router';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(public http: HttpClient,private storageService: StorageService,private router: Router) { }

  getProfile(): Observable<ResponseBase> {
    return this.http.get<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Shared}/Profile/GetProfilePermissionUser`
    );
  }

  ​zoneIdSalesExecutiveGroupIdGet(countryId: any, securityUsersId: any): Observable<ResponseBase> {
    const body = {
      businessId: countryId,
      securityUsersId: securityUsersId
    };
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Shared}/Profile/ZoneIdSalesExecutiveGroupIdGet`,
      body
    );
  }

  customerIdGet(businessId: any, securityUsersId: any): Observable<ResponseBase> {
    const body = {
      businessId: businessId,
      securityUsersId: securityUsersId
    };

    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Shared}/Profile/CustomerIdGet`,
      body
    );
  }

  ConfirmNotification(id: Number): Observable<ResponseBase> {
    return this.http.delete<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.NotificationPush}/Notification/ConfirmNotification?Id=${id}`
    );
  }

  public imageZoom() {
    const image = <HTMLElement>document.querySelectorAll('.image')[0];
    const zoom = <HTMLElement>document.querySelectorAll('.zoom')[0];
    const zoomImage = <HTMLElement>document.querySelectorAll('.zoom-image')[0];

    let clearSrc;
    let zoomLevel = 1;

    const enterImage = function (e) {
      zoom.classList.add('show', 'loading');
      clearTimeout(clearSrc);

      let posX,posY,touch = false;

      if (e.touches) {
        posX = e.touches[0].clientX - ($(document).width() / 9.6);
        posY = e.touches[0].clientY - ($(document).height() / 7.5);
        touch = true;
      } else {
        posX = e.clientX - ($(document).width() / 9.6);
        posY = e.clientY - ($(document).height() / 7.5);
      }

      touch ?
      zoom.style.top = `${posY - zoom.offsetHeight / 1.25}px` :
      zoom.style.top = `${posY - zoom.offsetHeight / 2}px`;
      zoom.style.left = `${posX - zoom.offsetWidth / 2}px`;

      let originalImage = image.getElementsByTagName('img')[0].getAttribute('src');

      zoomImage.setAttribute('src', originalImage);

      // remove the loading class
      zoomImage.onload = function () {
        setTimeout(() => {
          zoom.classList.remove('loading');
        }, 500);
      };
    };


    const leaveImage = function () {
      // remove scaling to prevent non-transition 
      zoom.style.transform = null;
      zoomLevel = 1;
      zoom.classList.remove('show');
      clearSrc = setTimeout(() => {
        zoomImage.setAttribute('src', '');
      }, 250);
    };


    const move = function (e) {
      e.preventDefault();

      let posX,posY,touch = false;

      if (e.touches) {
        posX = e.touches[0].clientX - ($(document).width() / 9.6);
        posY = e.touches[0].clientY - ($(document).height() / 7.5);
        touch = true;
      } else {
        posX = e.clientX - ($(document).width() / 9.6);
        posY = e.clientY - ($(document).height() / 7.5);
      }

      // move the zoom a little bit up on mobile (because of your fat fingers :<)
      touch ?
      zoom.style.top = `${posY - zoom.offsetHeight / 1.25}px` :
      zoom.style.top = `${posY - zoom.offsetHeight / 2}px`;
      zoom.style.left = `${posX - zoom.offsetWidth / 2}px`;

      let percX = (posX - this.offsetLeft) / this.offsetWidth,
      percY = (posY - this.offsetTop) / this.offsetHeight;

      let zoomLeft = -percX * zoomImage.offsetWidth + zoom.offsetWidth / 2,
      zoomTop = -percY * zoomImage.offsetHeight + zoom.offsetHeight / 2;

      zoomImage.style.left = `${zoomLeft}px`;
      zoomImage.style.top = `${zoomTop}px`;
    };



    image.addEventListener('mouseover', enterImage);
    image.addEventListener('touchstart', enterImage);

    image.addEventListener('mouseout', leaveImage);
    image.addEventListener('touchend', leaveImage);

    image.addEventListener('mousemove', move);
    image.addEventListener('touchmove', move);


    image.addEventListener('wheel', e => {
      e.preventDefault();
      e.deltaY > 0 ? zoomLevel-- : zoomLevel++;

      if (zoomLevel < 1) zoomLevel = 1;
      if (zoomLevel > 5) zoomLevel = 5;
      
      zoom.style.transform = `scale(${zoomLevel})`;
    });
  }

  refreshTokenB2b(token: string): Observable<ResponseBase> {
    const data = {
      refreshToken: token
    };
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Shared}/Profile/RefreshTokenB2bGet`,
      data
    );
  }

  refreshToken(refresh:boolean){
    let that = this;
    let currentUserAplication: any = that.storageService.getUser();
    let refreshToken = currentUserAplication.refresh_token;
    let seconds = currentUserAplication.expires_in - 60;
    let currentTime = new Date();
    currentTime.setSeconds(seconds); 
    let isOperator = that.storageService.getProfiles().role == RoleProfileInternal.FOPS_COMPANY_OPERADORPISO ? true : false;    
    if(new Date() > currentTime){
      if(isOperator){
        that.refreshTokenB2b(refreshToken).subscribe(
          (response) => {
            currentTime = new Date();
            if (response.status) {
              refreshToken = response.data.refresh_token;
              seconds = response.data.expires_in - 60;
              currentTime.setSeconds(seconds);
              that.storageService.refreshToken(response.data); 
              if(refresh){
                window.location.reload();
              }
            } else {
              console.log(response.message);
            }
          },
          (error) => {
            console.log(error.message);
          },
          () => {
          }
        );
      }
      else{
        that.storageService.logoutUserInterceptor();
      }      
    }    
  }
}
