import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import * as signalR from '@microsoft/signalr';
import { NotificationDto } from 'src/app/shared/models/notification-dto';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [MessageService, DatePipe]
})

export class NavbarComponent implements OnInit, OnDestroy {
  notifications: Array<NotificationDto>;
  notificationActive: NotificationDto;
  title = 'Microsoft identity platform';
  isIframe = false;
  loginDisplay = false;
  isEnglish = true;
  currentUserAplication: any;
  private readonly _destroying$ = new Subject<void>();
  configService: any;
  display: boolean;

  registerForm!: FormGroup;

  countrys = [];
  business = [];
  profile = [];
  securityUsersId = 0;
  indicatorButton = false;
  
  constructor(
    private datePipe: DatePipe,
    private authService: MsalService,
    public translate: TranslateService,
    private sharedService: SharedService,
    private router: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.currentUserAplication = this.storageService.getUser();
    let that = this;
    if (this.currentUserAplication != null) {
      let currentLang: string;
      currentLang = this.storageService.getLanguage() ? this.storageService.getLanguage() : 'en';
      this.translate.addLangs(['en', 'es']);
      this.translate.setDefaultLang(currentLang);
      this.translate.use(currentLang);
      this.isEnglish = !(this.storageService.getLanguage() == 'es');
      this.notifications = JSON.parse(localStorage.getItem('notifications'));
      this.isIframe = window !== window.parent && !window.opener;
      this.setLoginDisplay();
      this.ListenNotifications();
      this.getForm();
      this.getProfileService();   
      setInterval(function () {
        that.sharedService.refreshToken(false);
      }, environment.refreshTokenTime);
    }
  }

  ListenNotifications() {
    const that = this;
    $(document).ready(function () {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(environment.config.urlNotifications + that.currentUserAplication.email)
        .withAutomaticReconnect()
        .build();

      connection.onclose(that.start);
      that.start(connection);
    });
  }

  start(connection) {
    try {
      connection.start();
      console.log("SignalR Connected.");
      connection.on("ReceiveNotification", (message) => {
        let objMessage = JSON.parse(message);
        if (!this.notifications) {
          this.notifications = new Array<NotificationDto>();
        }

        if (this.notifications.filter(x => x.IdNotification === objMessage.IdNotification).length <= 0) {
          this.notifications.push(objMessage);
        }
        this.notifications.forEach((item, index) => {
          item.Time = this.getTime(item.DateServer);
        });
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
      })
    } catch (err) {
      setTimeout(this.start, 5000);
    }
  }

  getTime(date: string) {
    const year = Number(this.datePipe.transform(date, 'yyyy'));
    const month = Number(this.datePipe.transform(date, 'MM')) - 1;
    const day = Number(this.datePipe.transform(date, 'dd'));
    const hour = Number(this.datePipe.transform(date, 'HH'));
    const minute = Number(this.datePipe.transform(date, 'mm'));
    const second = Number(this.datePipe.transform(date, 'ss'));
    const milisecond = Number(this.datePipe.transform(date, 'ms'));
    return this.timeSince(new Date(year, month, day, hour, minute, second, milisecond));
  }

  timeSince(date: Date) {

    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return "Just now";
  }

  viewNotification(notification: NotificationDto) {
    this.notificationActive = notification;
    this.sharedService.ConfirmNotification(notification.IdNotification).subscribe(
      (response) => {
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => {
      }
    );
    this.notifications = this.notifications.filter(x => x.IdNotification !== notification.IdNotification);
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    this.display = true;
  }

  logout() {
    this.storageService.logoutUser();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  switchLang(lang: string, reload = true) {
    this.isEnglish = true;
    this.storageService.addLanguage(lang);
    this.isEnglish = !(this.translate.currentLang == "es");
    if (reload) {
      this.translate.use(lang);
      window.location.reload();
    }
  }

  getProfileService() {
    this.sharedService.getProfile().subscribe(
      (response) => {
        if (response.status) {
          this.countrys = response.data.countryProfile;
          this.securityUsersId = response.data.securityUsersId;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => {
      }
    );
  }

  private getForm() {
    return (this.registerForm = this.formBuilder.group({
      countrys: ['', Validators.required],
      business_facility: ['', Validators.required],
      profile_role: ['', Validators.required]
    }));
  }

  onChangeContrys(event: any) {
    this.business = [];
    this.profile = [];
    const filter = this.countrys.filter(
      (list) => list.countryId === event.value
    );
    this.business = filter[0].business;
  }

  onChangeBusiness(event: any) {
    this.profile = [];
    const filter = this.business.filter(
      (list) => list.businessId === event.value
    );
    this.profile = filter[0].groups;
  }

  onSubmitRole(): void {
    this.prfileUserGrup(this.registerForm.get('business_facility').value, this.securityUsersId);
  }

  prfileUserGrup(businessId: any, securityUsersId: any): void {
    const data = {
      "businessId": businessId,
      "role": this.registerForm.get('profile_role').value
    }
    this.storageService.addProfiles(data);
    this.indicatorButton = true;
    
    this.sharedService.zoneIdSalesExecutiveGroupIdGet(businessId, securityUsersId).subscribe(
      (response) => {
        console.log(response)
        if (response.status) {
          this.storageService.addGrup(response.data);
          window.location.reload();
        } else {
          this.indicatorButton = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        this.indicatorButton = false;
      },
      () => {
        this.indicatorButton = false;
      }
    );

  }
}