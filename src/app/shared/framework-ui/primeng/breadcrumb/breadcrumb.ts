import {NgModule,Component,Input, Output, EventEmitter,ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { TooltipModule } from '../tooltip/public_api';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'p-breadcrumb',
    template: `
    <div class="row">
        <div class="col-12 col-xl-12">
          <nav class="page-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item {{item.current ? 'active' : ''}}" *ngFor="let item of model"
              routerLink='{{item.url}}' >{{ item.label | translate }}</li>
            </ol>
          </nav>
        </div>
    </div>

    <div class="row mb-1" *ngIf="tittle">
      <div class="col-12 col-xl-12">
        <div class="d-flex justify-content-between align-items-baseline mb-2">
          <h4 class="ttile-page">
          <img *ngIf="imgShopping"  
                class="mr-1 simple-img action-img-tittle m-0"
                src="../../../assets/images/Carrito_de_compras_rojo.svg"
                alt="shopping cart" />
            {{ tittle | translate }}
          </h4>
        </div>
      </div>
    </div>

   <div class="row mb-1"  *ngIf="description">
      <div class="col-12 col-xl-12">
        <p class="description-page mb-2">
          {{ description | translate }}
        </p>
      </div>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./breadcrumb.css'],
    host: {
        'class': 'p-element'
    }
})
export class Breadcrumb {

    @Input() model: any[];

    @Input() style: any;

    @Input() styleClass: string;

    @Input() tittle: string;

    @Input() imgShopping: boolean;

    @Input() description: string;

    @Input() home: any;

    @Input() homeAriaLabel: string;

    @Output() onItemClick: EventEmitter<any> = new EventEmitter();

    itemClick(event, item: any) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }

        this.onItemClick.emit({
            originalEvent: event,
            item: item
        });
    }

    onHomeClick(event) {
        if (this.home) {
            this.itemClick(event, this.home);
        }
    }
}

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }

@NgModule({
    imports: [CommonModule,RouterModule,TooltipModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      }),],
    exports: [Breadcrumb,RouterModule,TooltipModule],
    declarations: [Breadcrumb]
})

export class BreadcrumbModule { 
    constructor(private translate: TranslateService) { }
}