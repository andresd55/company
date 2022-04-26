import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PopupRequest, RedirectRequest, AuthenticationResult, LogLevel } from '@azure/msal-browser';
import { PublicClientApplication } from '@azure/msal-browser';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  registerForm!: FormGroup;
  registerFormLogin: FormGroup;
  displayLogin = false;
  showError = false;
  showErrorText = "";
  titleLogin = "";

  userType = [
    {
      code: '2',
      name: 'Finotex team'
    }
  ]

  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private storageService: StorageService,
    private formBuilder: FormBuilder) { }

  get formControls() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.getFormTypeUser();
    this.getFormLoginUser();
  }

  private getFormTypeUser() {
    return (this.registerForm = this.formBuilder.group({
      user_type: ['2', Validators.required]
    }));
  }

  private getFormLoginUser() {
    return (this.registerFormLogin = this.formBuilder.group({
      username: ['', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      password: ['', Validators.required]
    }));
  }

  onSubmitTypeUser(): void {
    this.displayLogin = true;
    this.titleLogin = this.formControls.user_type.value == 1 ? "Finotex customer" : "Finotex team";
  }

  onSubmitLogin(): void {
   this.callServiceB2b();
  }

  callServiceB2b(): void {
    this.showError = false;
    this.profilesService.loginB2bGetFinotex(this.registerFormLogin.value).subscribe(
      (response) => {
        if (response.status) {
          this.setInfoLoginUser(response.data.access_token, response.data);
        }
      },
      (error) => {
        this.showError = true;
        this.showErrorText = error.error.message;
      },
      () => { this.displayLogin = false; }
    );
  }

  setInfoLoginUser(token: string, user: any) {
    this.storageService.addToken(token);
    this.storageService.addUserType(this.formControls.user_type.value);
    this.storageService.addUser(user)
    this.router.navigate(['profiles_roles']);
  }

}
