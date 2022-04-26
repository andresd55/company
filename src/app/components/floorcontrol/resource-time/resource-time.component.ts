import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';

@Component({
  selector: 'app-resource-time',
  templateUrl: './resource-time.component.html',
  styleUrls: ['./resource-time.component.css'],
  providers: [MessageService],
})
export class ResourceTimeComponent implements OnInit {
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  SearchFormAllProduct: FormGroup;
  submitted: boolean;
  showfilters: boolean;
  lang = 'en';
  settingsDate = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['approvedDate'],
    labels: 'Fecha',
  };
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'floor-control.floor-control', url: '/home/floorcontrol', current: true },
  ];

  constructor(private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this._InitForms();
  }

  _InitForms() {
    this.SearchFormAllProduct = this.formBuilder.group({
      states: ['', Validators.nullValidator],
      order: ['', Validators.nullValidator],
      code: ['', Validators.nullValidator],
      promisedDate: ['', Validators.nullValidator],
      approvedDate: ['', Validators.nullValidator],
      customers: ['', Validators.nullValidator],
      description: ['', Validators.nullValidator],
      cuts: ['', Validators.nullValidator],
    });
  }

  searchFilter() {

  }

  resetFilter() {

  }

  onSubmitFilterSearch(event) {

  }

  showPanelFilter(){
    this.showfilters = !this.showfilters;
  }

  closeMenu() {

  }

}
