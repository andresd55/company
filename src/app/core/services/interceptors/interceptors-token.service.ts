import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { catchError, switchMap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorsTokenService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Ingreso al interceptor");
    //implementar cargador de los servicios loader...
    let storageService = this.injector.get(StorageService);
    let authService = this.injector.get(MsalService);
    let sharedService = this.injector.get(SharedService);
    
    let reqToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${storageService.getUserLocal()}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: {
        ...req.body,
        "businessId": storageService.getProfiles() != null ? storageService.getProfiles().businessId : null,
        "language": storageService.getLanguage() == 'es' ? 'SP' : 'EN'
      }
    });
    return next.handle(reqToken).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401) {
          const scopes = {
            scopes: ['api://98c68b8e-0d50-4961-b352-5cd5040b1e1e/access_as_user']
          }

          return authService.acquireTokenSilent(scopes).pipe(
            switchMap(authResponse => {
              storageService.addToken(authResponse.accessToken);
              req = req.clone({
                setHeaders: {
                  authorization: `Bearer ${authResponse.accessToken}`,
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
                body: {
                  ...req.body,
                  "businessId": storageService.getProfiles() != null ? storageService.getProfiles().businessId : null,
                  "language": storageService.getLanguage() == 'es' ? 'SP' : 'EN'
                }
              });
              return next.handle(req);
            }),
            catchError((e: HttpErrorResponse) => {
              sharedService.refreshToken(true);             
              return EMPTY;
            })
          );
        }
        return throwError(e);
      })
    );
  }

}
