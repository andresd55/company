import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from '../../primeng/paginator/public_api';

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuantityImputComponent),
  multi: true
};

@Component({
  selector: 'app-search-selector',
  template: ` <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="{{ placeholder | translate }}"
                  aria-describedby="basic-addon2"
                  [value]="value"
                  readonly
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" (click)="executeAction($event)" type="button">
                    {{ 'artWork.btnSelect' | translate }}
                  </button>
                </div>
              </div>`,
  styleUrls: ['./search-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectorComponent),
      multi: true
    }
  ],
  host: {
    'class': 'p-element'
  }
})
export class SearchSelectorComponent implements OnInit, ControlValueAccessor, OnChanges {

  @Input() placeholder: string = "";
  @Output() clickEvent: EventEmitter<any> = new EventEmitter();

  value = "";

  constructor() { }

  writeValue(data: any): void {
    this.value = data;
  }

  registerOnChange(fn: any): void { }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit(): void { }

  executeAction(data: any) {
    this.clickEvent.emit(data);
  }

}

@Component({
  selector: 'app-search-selector-principal',
  template: ` <div class="input-group-finotex">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="{{ placeholder | translate }}"
                    aria-describedby="basic-addon2"
                    [value]="value"
                    #valueInput
                  />
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary-search" (click)="executeAction($event)" type="button">
                      <i class="{{ icon }}"></i>
                    </button>
                  </div>
                </div>
              </div>`,
  styleUrls: ['./search-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectorPrincipalComponent),
      multi: true
    }
  ],
  host: {
    'class': 'p-element'
  }
})
export class SearchSelectorPrincipalComponent implements OnInit, ControlValueAccessor {

  @Input() placeholder: string = "";
  @Output() clickEvent: EventEmitter<any> = new EventEmitter();
  @Input() icon?: string;
  @ViewChild('valueInput') valueInput: ElementRef;

  value = "";

  constructor() { }

  writeValue(obj: any): void { }

  registerOnChange(fn: any): void { }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  ngOnInit(): void { }

  executeAction(data: any) {
    this.clickEvent.emit(this.valueInput.nativeElement.value);
  }

}

@Component({
  selector: 'app-quantity-input',
  template: ` <div class="input-group">
                <input
                  [disabled]="disabled"
                  [attr.id]="inputId"
                  type="number"
                  (change)="updateQuantity()"
                  class="form-control number-border"
                  placeholder="{{ placeholder | translate }}"
                  aria-describedby="basic-addon2"
                  (input)="onUserInput($event.target.value)"
                  [value]="value"
                />
                <div class="input-group-append">
                  <div class="outline-secondary">
                    <span class="input-group-text">{{ titleButton }}</span>
                  </div>
                </div>
              </div>`,
  styleUrls: ['./search-selector.component.css'],
  host: {
    'class': 'p-element'
  },
  providers: [CALENDAR_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,

})
export class QuantityImputComponent implements OnInit, ControlValueAccessor {

  @Input() inputId: string;
  @Input() placeholder: string = "";
  @Input() titleButton: string = "";
  @Output() clickEvent: EventEmitter<any> = new EventEmitter();
  @Output() keyboardInput: EventEmitter<any> = new EventEmitter();
  @Output() changeInput: EventEmitter<any> = new EventEmitter();
  @Input() disabled: any;

  onChange = (_:any) => { }
  onTouch = () => { }

  value = "";

  constructor(public cd: ChangeDetectorRef) { }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void { 
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { 
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onUserInput(value) {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
    this.keyboardInput.emit(value);
  }

  updateQuantity() {
    this.changeInput.emit(1)
  }

  ngOnInit(): void { }

  executeAction(data: any) {
    this.clickEvent.emit(data);
  }

}

@NgModule({
  declarations: [SearchSelectorComponent, SearchSelectorPrincipalComponent, QuantityImputComponent],
  exports: [SearchSelectorComponent, SearchSelectorPrincipalComponent, QuantityImputComponent],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class SearchSelectorFinotexModule { }