import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  providers: [MessageService]
})
export class ProfilesComponent implements OnInit {

  registerForm!: FormGroup;

  countrys = [];
  business = [];
  profile = [];
  securityUsersId = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private messageService: MessageService,
    private storageService: StorageService,
    private authService: MsalService,
    private translate: TranslateService) {
    translate.addLangs(['en', 'fr', 'de', 'pt', 'es']);
    translate.setDefaultLang(this.storageService.getLanguage() ? this.storageService.getLanguage() : 'en');
  }

  ngOnInit(): void {
    this.authService.instance = new PublicClientApplication({
      auth: environment.auth
    });

    this.getForm();
    this.getProfileService();
  
  }

  private getForm() {
    return (this.registerForm = this.formBuilder.group({
      countrys: ['', Validators.required],
      business_facility: ['', Validators.required],
      profile_role: ['', Validators.required]
    }));
  }

  onSubmitRole(): void {
    this.prfileUserGrup(this.registerForm.get('business_facility').value, this.securityUsersId);
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

  prfileUserGrup(businessId: any, securityUsersId: any): void {
    const data = {
      "businessId": businessId,
      "role": this.registerForm.get('profile_role').value
    }
    this.storageService.addLanguage('en');
    this.storageService.addProfiles(data);
    
    this.sharedService.zoneIdSalesExecutiveGroupIdGet(businessId, securityUsersId).subscribe(
      (response) => {
        if (response.status) {
          this.storageService.addGrup(response.data);
          this.router.navigate(['/home']);
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
}
