import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, AfterViewInit, NgModule, AfterContentChecked } from '@angular/core';
import { FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { httpTranslateLoader } from '../../primeng/paginator/paginator';

declare var $: any;

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatepickerComponent implements OnInit,  AfterViewInit, AfterContentChecked {

  @Input() right = '24';
  @Input() config: any;
  @Input() form: FormGroup;
  @Input() formDirective: FormGroupDirective;
  @Input() submitted: Boolean;
  @Input() subGroupClicked: boolean;
  @Input() readonly: boolean;
  @Input() styleHTML: string;
  
  defaults: any;
  settings: any;
  isConfigured: boolean;
  constructor(
    public translate: TranslateService,
    private storageService: StorageService
  ) {
  }
  ngAfterContentChecked(): void {
    //console.log("ngAfterContentChecked")
    //this.ConfigureDatePicker()
  }

  ngAfterViewInit() {
    $.datepicker.setDefaults($.datepicker.regional[this.storageService.getLanguage()]);
  }

  ngOnInit() {
    $.datepicker.setDefaults($.datepicker.regional[this.storageService.getLanguage()]);
    moment.locale(this.storageService.getLanguage());

    this.defaults = {
      isRange: false,
      ids: ['datepicker'],
      labels: ['Fecha 1'],
      dateFormat: 'yy-mm-dd',
      required: false,
      maxDate: null,
      minDate: null
    };

    this.settings = Object.assign({}, this.defaults, this.config);
    this.isConfigured = false;

    const that = this;
    $(function() {
      $('.datepicker').css('right', that.right + 'px');
    });
  }

  get f() { return this.form.controls; }

  IsValid(control: string): boolean {
    return this.form.get(control).valid;
  }

  onKey(): boolean {
    return false;
  }

  ConfigureDatePicker() {
    if (!this.isConfigured) {
      if (!this.settings.isRange) {
        this._SingleDatePicker();
      } else {
        this._RangeDatePicker();
      }
      this.isConfigured = true;
    }
  }

  OnDateSelect(event: Event) {
    const el: HTMLInputElement = event.target as HTMLInputElement;
    this.form.get(el.name).setValue(el.value);
  }

  public _SingleDatePicker(): void {
    const el = $('#' + this.settings.ids[0]);
    el.datepicker(
      {
        minDate: this.settings.minDate,
        changeMonth: true,
        changeYear: true,
        dateFormat: this.settings.dateFormat,
        maxDate: this.settings.maxDate,
        showOtherMonths: true,
        selectOtherMonths: true,
        showButtonPanel: true,
        onSelect(dateText, inst) {

          const evt = document.createEvent('HTMLEvents');
          evt.initEvent('change', false, true);
          inst.input[0].dispatchEvent(evt);
          el.trigger('change');
        }
      }
    );
  }

  private _RangeDatePicker(): void {
    const el = $('#' + this.settings.ids[0]);
    //$.datepicker.setDefaults($.datepicker.regional[this.storageService.getLanguage()]);
    el.datepicker(
      {
        minDate: this.settings.minDate,
        changeMonth: true,
        numberOfMonths: 2,
        changeYear: true,
        dateFormat: this.settings.dateFormat,
        maxDate: this.settings.maxDate,
        showOtherMonths: true,
        selectOtherMonths: true,
        showButtonPanel: true,
        onSelect: function (selectedDate, inst) {
          if (!$(this).data().datepicker.first) {
            $(this).data().datepicker.inline = true
            $(this).data().datepicker.first = selectedDate;
          } else {
            let selectDate = moment(selectedDate, "MMM/DD/YYYY").format("YYYY-MM-DD");
            let firstDate = moment($(this).data().datepicker.first, "MMM/DD/YYYY").format("YYYY-MM-DD");
            if (selectDate > firstDate) {
              $(this).val($(this).data().datepicker.first + " - " + selectedDate);
            } else {
              $(this).val(selectedDate + " - " + $(this).data().datepicker.first);
            }
            $(this).data().datepicker.inline = false;
          }

          const evt = document.createEvent('HTMLEvents');
          evt.initEvent('change', false, true);
          inst.input[0].dispatchEvent(evt);
          el.trigger('change');
        },
        onClose: function () {
          delete $(this).data().datepicker.first;
          $(this).data().datepicker.inline = false;
        }
      }
    );
  }
}

@NgModule({
  declarations: [DatepickerComponent],
  exports: [DatepickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class DatepickerComponentModule { }