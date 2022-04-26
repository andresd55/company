import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from '../ui/sidebar/sidebar.component';
import { FooterComponent } from '../ui/footer/footer.component';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'src/app/shared/framework-ui/primeng/button/button';
import { CoreModule } from 'src/app/core/core/core.module';
import { CardModule } from 'src/app/shared/framework-ui/primeng/card/public_api';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TableModule } from 'src/app/shared/framework-ui/primeng/table/public_api';
import { InputTextModule } from 'src/app/shared/framework-ui/primeng/inputtext/inputtext';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DropdownModule } from 'src/app/shared/framework-ui/primeng/dropdown/public_api';
import { DatepickerComponentModule } from 'src/app/shared/framework-ui/custom/datepicker/datepicker.component';
import { TooltipModule } from 'src/app/shared/framework-ui/primeng/tooltip/tooltip';
import { DialogModule } from 'src/app/shared/framework-ui/primeng/dialog/public_api';
import { InputTextareaModule } from 'src/app/shared/framework-ui/primeng/inputtextarea/public_api';
import { MultiSelectModule } from 'src/app/shared/framework-ui/primeng/multiselect/public_api';
import { RippleModule } from 'src/app/shared/framework-ui/primeng/ripple/public_api';
import { AccordionModule } from 'src/app/shared/framework-ui/primeng/accordion/accordion';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { ProfilesComponent } from '../login/profiles/profiles.component';
import { CheckboxModule } from 'src/app/shared/framework-ui/primeng/checkbox/public_api';
import { ToastModule } from 'src/app/shared/framework-ui/primeng/toast/public_api';
import { MsalService, MsalModule, MsalRedirectComponent, MsalInterceptorConfiguration, MsalInterceptor, MSAL_INTERCEPTOR_CONFIG, MSAL_INSTANCE } from '@azure/msal-angular';
import { AppComponent } from 'src/app/app.component';
import { RadioButtonModule } from 'src/app/shared/framework-ui/primeng/radiobutton/public_api';
import { PaginatorModule } from 'src/app/shared/framework-ui/primeng/paginator/paginator';
import { InterceptorsTokenService } from 'src/app/core/services/interceptors/interceptors-token.service';
import { BreadcrumbModule } from 'src/app/shared/framework-ui/primeng/breadcrumb/public_api';
import { TimelineModule } from 'src/app/shared/framework-ui/primeng/timeline/public_api';
import { ContextMenuModule } from 'src/app/shared/framework-ui/primeng/contextmenu/contextmenu';
import { environment } from 'src/environments/environment';
import { CalendarModule } from 'src/app/shared/framework-ui/primeng/calendar/calendar';
import { OrdersListComponent } from '../floorcontrol/orders-list/orders-list.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { FloorControlLoginComponent } from '../floorcontrol/floor-control-login/floor-control-login.component';
import { ButtonFinotexModule } from 'src/app/shared/framework-ui/custom/button-finotex/button-finotex.component';
import { SearchSelectorFinotexModule } from 'src/app/shared/framework-ui/custom/search-selector/search-selector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CodebarComponent } from '../floorcontrol/codebar/codebar.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { viewerModule } from 'src/app/shared/framework-ui/custom/viewer/viewer.component';
import { ScannerModule } from 'src/app/shared/framework-ui/custom/scanner/scanner.component';
import { ResourceTimeComponent } from '../floorcontrol/resource-time/resource-time.component';


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth : environment.auth
  })
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  protectedResourceMap.set('https://FinotexB2C.onmicrosoft.com/e8529ad6-7364-454a-afac-6c74edc7d5d3/access_as_user', ['access_as_user']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    DashboardComponent,
    ProfilesComponent,
    OrdersListComponent,
    FloorControlLoginComponent,
    CodebarComponent,
    ResourceTimeComponent
  ],
  imports: [
    ZXingScannerModule,
    DragDropModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    CoreModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    AutocompleteLibModule,
    DropdownModule,
    DialogModule,
    viewerModule,
    ScannerModule,
    InputTextareaModule,
    MultiSelectModule,
    TooltipModule,
    RippleModule,
    AccordionModule,
    CheckboxModule,
    ToastModule,
    RadioButtonModule,
    ButtonFinotexModule,
    SearchSelectorFinotexModule,
    DatepickerComponentModule,
    CalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    TableModule,
    PaginatorModule,
    MsalModule,
    BreadcrumbModule,
    TimelineModule,
    ContextMenuModule,
    NgQrScannerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    }, 
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsTokenService,
      multi: true
    }
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AplicationModule { }
