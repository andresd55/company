import {
    NgModule, Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ElementRef, NgZone, Input, TemplateRef, QueryList, ContentChildren, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from '../api/shared';
import { PaginatorModule } from 'src/app/shared/framework-ui/primeng/paginator/paginator';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@Component({
    selector: 'p-table',
    template: `<div class="table-responsive {{cards ? 'product' : ''}}">
                <table #table class="f-table" role="table">
                    <thead pTableHeader class="f-table-header" role="rowgroup">
                        <ng-content select="[theaderRecords]"></ng-content>
                    </thead>
                    <tbody class="text-center {{cards ? 'row tr-product' : ''}}" pTableBody role="rowgroup" >
                    <tr *ngIf="data.length == 0 " >
                        <td colspan="50" class="text-center bg-white p-0" >
                        <img  class="simple-img img-not-data"
                            src="../../../../assets/images/folder-open.svg" 
                            alt="profile" />
                        <div class="mb-16"><label class="text-no-data">{{ 'general.noData' | translate  }}</label></div>
                        </td>
                    </tr>
                        
                    <ng-content select="[tbodyRecords]"></ng-content>
                    </tbody>                
                    </table>
                    
                
            <div *ngIf="summaryTemplate" class="p-datatable-footer">
                <ng-container *ngTemplateOutlet="summaryTemplate"></ng-container>
            </div>
                    </div>
                    <p-paginator [rows]="10" [columnsSeparate]="columnsSeparate" [rowsPerPageOptions]="[10, 20, 30]" (onPageChange)="paginate($event)" [totalRecords]="totalRecords"></p-paginator>
               `,

    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./table.css'],
    host: {
        'class': 'p-element'
    }
})
export class Table implements OnInit {
    @Output() onPageChange: EventEmitter<any> = new EventEmitter();
    @Input() data = [];
    @Input() paginator: boolean;
    @Input() cards: boolean;
    @Input() pageLinks: number = 5;
    @Input() totalRecords: number = 0;
    @Input() columnsSeparate: boolean = false;
    @Input() paginatorPosition: string = 'bottom';
    summaryTemplate: TemplateRef<any>;
    @ContentChildren(PrimeTemplate) templates: QueryList<any>;
    _rows: number;
    @Input() get rows(): number {
        return this._rows;
    }
    set rows(val: number) {
        this._rows = val;
    }

    constructor(public translate: TranslateService) {}

    ngOnInit(): void {      
    }

    paginate(event) {
        this.onPageChange.emit(event);
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'summary':
                    this.summaryTemplate = item.template;
                break;
            }
        });
    }
}

@Component({
    selector: 'pTableHeader',
    template: `<ng-content></ng-content>`,

    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
})
export class TableHeader implements OnInit {

    constructor(public el: ElementRef, public zone: NgZone, public cd: ChangeDetectorRef) {}

    ngOnInit(): void {      
    }
}

@Component({
    selector: 'pTableBody',
    template: `<ng-content></ng-content>`,

    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
})
export class TableBody implements OnInit {

    constructor() {}

    ngOnInit(): void {      
    }
}

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }

@NgModule({
    imports: [CommonModule, PaginatorModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      })],
    exports: [Table],
    declarations: [Table, TableBody, TableHeader]
})
export class TableModule { }
