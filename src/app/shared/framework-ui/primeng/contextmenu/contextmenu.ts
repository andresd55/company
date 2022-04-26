import { NgModule, Component, ElementRef, Input, Output, ViewChild, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TooltipModule } from '../tooltip/tooltip';
import { RippleModule } from '../ripple/ripple';
import { ContextMenuService } from '../api/contextmenuservice';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'p-contextMenu',
    template: `
        <div id="{{customerId}}" class="p-contextmenu" *ngIf="visible">
            <ul><li *ngFor="let item of items" (click)="onItemClick(item)"><p>{{ item.label | translate }}</p>
            <em class="fas fa-chevron-right arrow" *ngIf="item.subitems"></em>
            <div id="{{customerId}}" class="p-contextmenu-sub" *ngIf="item.subitems && item.subitemsVisibles">
                <ul>
                <li *ngFor="let subitem of item.subitems" (click)="onSubItemClick(subitem)" ><p>{{ subitem | translate }}</p></li>
                </ul>
            </div>
            </li></ul>
        </div>
        
    `,
    encapsulation: ViewEncapsulation.None, styleUrls: ['./contextmenu.css'],
    host: {
        'class': 'p-element'
    }
})
export class ContextMenu implements OnInit {

    @Input() items: any;

    @Input() visible: boolean = false;

    @Input() customerId: string = "";

    @Input() target: any;

    @Output() itemClick: EventEmitter<any> = new EventEmitter();

    @Output() subItemClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('sublist') sublistViewChild: ElementRef;

    @ViewChild('menuitem') menuitemViewChild: ElementRef;

    activeItemKey: string;

    hideTimeout: any;

    activeItemKeyChangeSubscription: Subscription;

    ngOnInit(): void {
        // console.log(this.customerId);
    }

    ContextMenuById(customerId: string) {
        console.log(customerId);
    }

    onItemClick(item) {
        this.itemClick.emit(item);
    }

    onSubItemClick(item) {
        this.subItemClick.emit(item);
    }
}

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }


@NgModule({
    imports: [CommonModule, RouterModule, RippleModule, TooltipModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      })],
    exports: [ContextMenu, RouterModule, TooltipModule],
    declarations: [ContextMenu],
    providers: [ContextMenuService]
})
export class ContextMenuModule { 
    constructor(private translate: TranslateService) { }
}
