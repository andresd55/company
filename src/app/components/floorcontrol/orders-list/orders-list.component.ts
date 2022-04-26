import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { WmsService } from 'src/app/core/services/wms/wms.service';
import { RoleProfileInternal } from 'src/app/shared/constant/roleProfile';
import { ProductionMastersService } from 'src/app/core/services/productionMasters/production-masters.service';
import * as moment from 'moment'

declare var $: any;
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})

export class OrdersListComponent implements OnInit {
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  SearchFormAllProduct: FormGroup;
  lang = 'en';

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'floor-control.floor-control', url: '/home/floorcontrol', current: true },
  ];

  items = [
    {
      label: 'floor-control.orderBy',
      subitems: [
        'floor-control.stateS',
        'floor-control.orderNumber',
        'floor-control.code',
        'floor-control.promisedDate',
        'floor-control.quantity',
      ],
      subitemsVisibles: false
    },
    { label: 'floor-control.ViewTot', current: true },
  ];

  settingsDatePromised = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['promisedDate'],
    labels: 'floor-control.promisedDate',
  };

  settingsDateAproved = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['approvedDate'],
    labels: 'floor-control.approvedDate',
  };

  showAdvanceSuccessful: boolean = false;
  showAdvanceFail: boolean = false;
  showAdvanceError: boolean = false;
  arrowRight: boolean = false;
  showAdvanceNumberOrder: string = "";
  nameStateNext: string = "";
  nameProcessNext: string = "";
  nameActualColumn: string = "";
  showfilters: boolean;
  showTotalizado: boolean = false;
  showCheckList: boolean = false;
  checkListOrderId: number = 0;
  showDialogProduction: boolean = false;
  ProductionOrderId: number = 0;
  orderAdvance: string = "";
  orderItem: string = '';
  columnVisible = '';
  showItems = false;
  displayFilePreview: boolean = false;
  displayMoveOrder: boolean = false;
  displayChangeConfiguration: boolean = false;
  displayDetail: boolean = false;
  order: Order;
  submitted: boolean;
  pageLenght = 12;

  customers = [];
  cuts = [];
  language = this.storageService.getLanguage();
  states = this.language == "es" ? environment.floorControlStateEs : environment.floorControlStateEn;
  floorControl = this.storageService.getFloorControl();

  detailOrder: Detail = new Detail();
  totalizedStatus: Totalized = new Totalized();
  board: Board;
  orderP: Order[] = [];
  columnP: Column[] = [];
  sortOrder: string = 'ProductionOrderId';
  statusId = null;
  start: number = 0;
  quantity: number = environment.pageLenghtCard;
  quantityColumn1: number = environment.pageLenghtCard;
  quantityColumn2: number = environment.pageLenghtCard;
  quantityColumn3: number = environment.pageLenghtCard;
  productionOrderId: string = null;

  currentUserAplication: any;
  floorControlForm!: FormGroup;
  plants = [];
  process = [];
  isOperator = this.storageService.getProfiles().role == RoleProfileInternal.FOPS_COMPANY_OPERADORPISO ? true : false;
  productionMastersSchedule = this.language == "es" ? environment.productionMastersScheduleEs : environment.productionMastersScheduleEn;
  productionMastersTurns = this.language == "es" ? environment.productionMastersTurnsES : environment.productionMastersTurnsEn;
  displayDialogProcessOperator = false;
  checkList: Questions[] = [];
  paymentProducciont: boolean = false;

  operators = [];
  checkListForm: FormGroup;
  productionForm: FormGroup;

  get fp() { return this.productionForm.controls; }
  get p() { return this.fp.operators as FormArray; }
  get fc() { return this.checkListForm.controls; }
  get c() { return this.fc.items as FormArray; }

  refreshOrders: number = (environment.timeRefreshOrders * 1000);

  constructor(
    private router: Router,
    private readonly sharedService: SharedService,
    private readonly masterProductService: MasterProductService,
    private productionMastersService: ProductionMastersService,
    private wmsService: WmsService,
    private storageService: StorageService,
    private readonly formBuilder: FormBuilder,
    private translate: TranslateService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.currentUserAplication = this.storageService.getUser();
    this._InitForms();
    this.getFilters();
    this.getOrders(false, false);
    this.onloadPage();
    this.getForm();
    this.getPlant();
    this.getDefaultValues();
    this.initProductionForm();
    this.getCheckListForm();
    this.getCheckListItems();
    this.getPaymentProduction();

    setInterval(() => {
      this.statusId = StatesOrdes.statusOnHold;
      this.getOrders(true, false);      
    }, this.refreshOrders);

  }
  
  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  enableSaveProduction() : boolean
  {
    var identification = this.p.value[0].identification;        
    return identification ?  false : true;    
  }

  saveProduction() {
    var results: CreateOrderRouteOperatorDto[] = [];
    for (let index = 0; index < this.p.length; index++) {

      var identification = this.p.value[index].identification;

      var res = new CreateOrderRouteOperatorDto();
      res.userName = this.currentUserAplication.username;
      res.productionOrderId = this.ProductionOrderId;
      res.processId = this.floorControl.processId;
      res.operatorId = Number(identification);
      results.push(res);
    }

    var data =
    {
      createOrderRouteOperatorDtos: results
    };

    this.wmsService.insertOrderRoutePost(data)
      .subscribe(
        (response) => {
          if (response.status) {
            this.updateState(Number(this.ProductionOrderId), null, null, true);
            this.ProductionOrderId = 0;
            this.showDialogProduction = false;
            this.clearOperators();
          }
          else {

            this.ProductionOrderId = 0;
            this.clearOperators();
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: response.message,
            });

          }
        },
        (error) => {
          this.ProductionOrderId = 0;
          this.clearOperators();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );

  }

  saveCheckList() {

    var results: CreateAuditResultChecklistDtos[] = [];
    for (let index = 0; index < this.c.length; index++) {
      var questionNumber = this.c.value[index].questionNumber;
      var answerGroupId = this.c.value[index].answerGroupId;
      var check = this.c.value[index].check;
      var observations = this.c.value[index].Observations;

      var res = new CreateAuditResultChecklistDtos();
      res.productionOrderId = this.checkListOrderId;
      res.processId = this.floorControl.processId;
      res.questionNumber = questionNumber,
        res.answerGroupId = answerGroupId,
        res.responseTypeId = check == "" ? "NO" : "SI",
        res.notes = observations;
      res.createdByUser = this.currentUserAplication.username;

      results.push(res);
    }

    var data =
    {
      createAuditResultChecklistDtos: results
    };

  
    this.wmsService.insertCheckListQuestionsPost(data)
      .subscribe(
        (response) => {
          if (response.status) {
            this.messageChangeOrder(Number(this.checkListOrderId), StatesOrdes.statusInAction);
            this.updateState(Number(this.checkListOrderId), null, null);
            this.checkListOrderId = 0;
            this.showCheckList = false;
          }
          else {

            this.checkListOrderId = 0;
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: response.message,
            });

          }
        },
        (error) => {
          this.checkListOrderId = 0;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  closeCheckList() {
    this.getOrders(false, false);
    this.checkListOrderId = 0;
  }

  OpenCheckList() {
    $("textarea[id^='observations']").each(function (i, el) { $(el).val(''); });
    $("p-checkbox[id^='checkp-accordiontab'] input[type=checkbox]").filter("[aria-checked]").click();

    for (let index = 0; index < this.c.length; index++) {
      var item = this.c.value[index];
      item.Observations = '';
      item.check = '';
    }
  }

  closePaymentProduction() {
    this.clearOperators();
    this.getOrders(false, false);
    this.ProductionOrderId = 0;
  }

  clearOperators() {
    this.p.clear();
    this.p.push(this.formBuilder.group({
      identification: ['', []],
    }));
  }

  getCheckListItems() {

    let data = {
      processId: this.floorControl.processId,
    };

    this.wmsService.getCheckListQuestionsPost(data)
      .subscribe(
        (response) => {
          if (response) {

            this.checkList = response.data;

            for (let i = 0; i < this.checkList.length; i++) {
              this.c.push(this.formBuilder.group({
                check: ['', []],
                Observations: ['', []],
                questionNumber: [this.checkList[i].questionNumber, []],
                answerGroupId: [this.checkList[i].answerGroupId, []]
              }));
            }

          }
          else {
            this.checkList = [];
            this.c.clear();
          }
        },
        (error) => {
          if (error.error.message.includes("Not exist checklist form questions with process id")) {
            this.c.clear();
            this.checkList = [];
          }
          else {
            this.c.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          }
        },
        () => { }
      );
  }

  getPaymentProduction() {

    let data = {
      processId: this.floorControl.processId,
    };

    this.productionMastersService.getProcessPaymentProductionPost(data)
      .subscribe(
        (response) => {
          if (response.status) {
            this.paymentProducciont = response.data;
          }
          else {
            this.paymentProducciont = false;
          }
        },
        (error) => {
          this.paymentProducciont = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });

        },
        () => { }
      );
  }

  checkChange(event, tab) {

    const positionCheck = tab.id.replace('p-accordiontab-', '');
    const item = this.c.controls[positionCheck] as FormGroup;

    if (item) {
      item.controls.check.setValue(event.checked[0] ? '1' : '');
      var ctl = this.c.value[positionCheck];
      ctl.check = event.checked[0] ? '1' : '';
    }
  }

  initProductionForm() {
    this.productionForm = this.formBuilder.group({
      operators: new FormArray([])
    });

    this.p.push(this.formBuilder.group({
      identification: ['', []],
    }));
  }

  removeOperator() {
    if (this.p.length > 1) {
      this.p.removeAt(this.p.length - 1);
    }
  }

  addOperator() {
    this.p.push(this.formBuilder.group({
      identification: ['', []],
    }));
    $('.table-operators').animate({ scrollTop: $('.table-operators').height() }, 1000);
  }

  getCheckListForm() {
    this.checkListForm = this.formBuilder.group({
      items: new FormArray([])
    });
  }

  private getForm() {
    return (this.floorControlForm = this.formBuilder.group({
      plants: ['', Validators.required],
      process: ['', Validators.required],
      productionMastersSchedule: ['', this.isOperator ? Validators.required : Validators.nullValidator],
      productionMastersTurns: ['', this.isOperator ? Validators.required : Validators.nullValidator],
      identification: ['', this.isOperator ? Validators.required : Validators.nullValidator],
    }));
  }

  onloadPage() {
    const that = this;
    $(function () {
      $('#search input').css('border-radius', '10px 0px 0px 10px ');
      $('.board-wrapper').on("scroll", that.onScrollHandler({
        onStop: () => {
          $('.board-wrapper').css('overflow-x', 'hidden');
          setTimeout(function () {
            $('.board-wrapper').css('overflow-x', 'scroll');
            that.closeMenu();
          }, 100);
        }
      }));
      $('.board-wrapper').scroll(function () {
        that.closeMenu();
      });
    });
  }

  onScrollHandler(params: {
    onStop: () => void
  }) {
    const { onStop } = params
    let timer = null
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null
        onStop && onStop()
      }, 200);
    }
  };

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

  getFilters() {
    this.getCustomer();
    this.getCut();
  }

  getCustomer() {
    let data = {
      processId: this.floorControl.processId,
    };
    this.wmsService.getCustomerProcessId(data)
      .subscribe(
        (response) => {
          if (response) {
            this.customers = response.data;
          }
          else {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
        },
        (error) => {
          if (error.error.message.includes("Not exist customers with process Id")) {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: error.error.message,
                });
              });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          }
        },
        () => { }
      );
  }

  getCut() {
    this.masterProductService.getCutPost(null)
      .subscribe(
        (response) => {
          if (response) {
            this.cuts = response.data;
          }
          else {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  mapData() {
    moment.locale(this.storageService.getLanguage());
    var promisedDate, endDatePromised, approvedDate, endDateApproved;
    if (this.SearchFormAllProduct.get('promisedDate').value) {
      promisedDate = this.SearchFormAllProduct.get('promisedDate').value.split(' - ')[1];
      if (promisedDate) {
        endDatePromised = promisedDate;
      }
    }
    if (this.SearchFormAllProduct.get('approvedDate').value) {
      approvedDate = this.SearchFormAllProduct.get('approvedDate').value.split(' - ')[1];
      if (approvedDate) {
        endDateApproved = approvedDate;
      }
    }
    return {
      start: this.start,
      quantity: environment.pageLenghtCard,
      sortOrder: this.sortOrder,
      processId: this.floorControl.processId,
      productionStatusId: this.statusId,
      plantId: this.floorControl.plantId,

      startDatePromised: this.SearchFormAllProduct.get('promisedDate').value
        ? moment(
          this.SearchFormAllProduct.get('promisedDate').value.split(' - ')[0],
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 00:00:01'
        : null,
      endDatePromised: endDatePromised
        ? moment(
          endDatePromised,
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 23:59:59'
        : null,
      startDateApproved: this.SearchFormAllProduct.get('approvedDate').value
        ? moment(
          this.SearchFormAllProduct.get('approvedDate').value.split(' - ')[0],
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 00:00:01'
        : null,
      endDateApproved: endDateApproved
        ? moment(
          endDateApproved,
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 23:59:59'
        : null,
      semaphoreStatusId: this.SearchFormAllProduct.get('states').value == "" ? null : this.SearchFormAllProduct.get('states').value,
      productionOrderId: this.productionOrderId,
      productId: this.SearchFormAllProduct.get('code').value == "" ? null : this.SearchFormAllProduct.get('code').value,
      customerId: this.SearchFormAllProduct.get('customers').value == "" ? null : this.SearchFormAllProduct.get('customers').value,
      productName: this.SearchFormAllProduct.get('description').value == "" ? null : this.SearchFormAllProduct.get('description').value,
      cutId: this.SearchFormAllProduct.get('cuts').value == "" ? null : this.SearchFormAllProduct.get('cuts').value
    };
  }

  getOrders(ordering: boolean, showingMore: boolean) {
    var data = this.mapData();
    this.wmsService.getProductionOrderPost(data)
      .subscribe(
        (response) => {
          if (response) {
            if (ordering || showingMore) {
              var ordersOrderby = response.data;
              let columOrder = null;
              switch (this.statusId) {
                case StatesOrdes.statusOnHold:
                  if (ordering) {
                    columOrder = new Column('floor-control.pending', false, ordersOrderby, false, this.statusId);
                    this.board.columns[0] = columOrder;
                  } else {
                    this.board.columns[0].orders = this.board.columns[0].orders.concat(ordersOrderby);
                  }
                  break;
                case StatesOrdes.statusInAction:
                  if (ordering) {
                    columOrder = new Column('floor-control.excecution', false, ordersOrderby, false, this.statusId);
                    this.board.columns[1] = showingMore ? ((this.board.columns[1].orders).concat(columOrder)) : columOrder;
                  } else {
                    this.board.columns[1].orders = this.board.columns[1].orders.concat(ordersOrderby);
                  }
                  break;
                case StatesOrdes.statusAdvanceNextProcess:
                  if (ordering) {
                    columOrder = new Column('floor-control.finalized', false, ordersOrderby, false, this.statusId);
                    this.board.columns[2] = showingMore ? ((this.board.columns[2].orders).concat(columOrder)) : columOrder;
                  } else {
                    this.board.columns[2].orders = this.board.columns[2].orders.concat(ordersOrderby);
                  }
                  break;
              }
            }
            else {
              this.start = 0;
              this.quantity = environment.pageLenghtCard;
              this.quantityColumn1 = environment.pageLenghtCard;
              this.quantityColumn2 = environment.pageLenghtCard;
              this.quantityColumn3 = environment.pageLenghtCard;
              this.columnP = [];
              this.orderP = response.data;
              this.orderP.map(p => p.image = "https://upload.wikimedia.org/wikipedia/commons/b/b0/Zumba.png");
              var col1 = new Column('floor-control.pending', false, this.orderP.filter(p => p.productionStatusId == StatesOrdes.statusOnHold), false, StatesOrdes.statusOnHold);
              var col2 = new Column('floor-control.excecution', false, this.orderP.filter(p => p.productionStatusId == StatesOrdes.statusInAction), true, StatesOrdes.statusInAction);
              var col3 = new Column('floor-control.finalized', false, this.orderP.filter(p => p.productionStatusId == StatesOrdes.statusAdvanceNextProcess), true, StatesOrdes.statusAdvanceNextProcess);
              this.columnP.push(col1, col2, col3);
              this.board = new Board(this.columnP);
            }
          }
          else {

            if (this.sortOrder != '' && !ordering && !showingMore) {
              this.columnP = [];
              this.orderP = [];
              this.board = null;
              var column1 = new Column('floor-control.pending', false, null, false, StatesOrdes.statusOnHold);
              var column2 = new Column('floor-control.excecution', false, null, true, StatesOrdes.statusInAction);
              var column3 = new Column('floor-control.finalized', false, null, true, StatesOrdes.statusAdvanceNextProcess);
              this.columnP.push(column1, column2, column3);
              this.board = new Board(this.columnP);
            }

            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
          const that = this;
          setTimeout(function () {
            $('.orders-container').on("scroll", that.onScrollHandler({
              onStop: () => {
                $('.orders-container').css('overflow-y', 'hidden');
                setTimeout(function () {
                  $('.orders-container').css('overflow-y', 'scroll');
                }, 100);
              }
            }));
          }, 1000);
        },
        (error) => {
          this.columnP = [];
          this.orderP = [];
          this.board = null;
          var column1 = new Column('floor-control.pending', false, null, false, StatesOrdes.statusOnHold);
          var column2 = new Column('floor-control.excecution', false, null, true, StatesOrdes.statusInAction);
          var column3 = new Column('floor-control.finalized', false, null, true, StatesOrdes.statusAdvanceNextProcess);
          this.columnP.push(column1, column2, column3);
          this.board = new Board(this.columnP);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  searchFilter() {
    this.sortOrder = 'OrderId';
    this.statusId = null;
    this.productionOrderId = this.SearchFormAllProduct.get('order').value ? this.SearchFormAllProduct.get('order').value : null;
    this.SearchFormAllProduct.get('order').value
    this.start = 0;
    this.quantity = environment.pageLenghtCard;
    this.getOrders(false, false);
  }

  resetFilter() {
    this.SearchFormAllProduct.reset();
    this.sortOrder = 'OrderId';
    this.statusId = null;
    this.productionOrderId = null;
    this.getOrders(false, false);
  }

  onSubmitFilterSearch(order: string) {
    this.sortOrder = '';
    this.statusId = null;
    this.start = 0;
    this.quantity = environment.pageLenghtCard;
    this.productionOrderId = order == "" ? null : order;
    this.getOrders(false, false);
  }

  showDetail(order: Order) {
    this.displayDetail = true;
    this.detailOrder = new Detail();
    this.getDetailOrder(order);
  }

  doubleClick(order: Order) {
    this.showDetail(order);
  }

  getDetailOrder(order: Order) {
    let data = {
      productionOrderId: order.productionOrderId,
    };
    this.wmsService.getOrderDetailPost(data)
      .subscribe(
        (response) => {
          if (response) {
            this.detailOrder = response.data;
          } else {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  public showPanelFilter() {
    this.showfilters = !this.showfilters;
  }

  openPreviewFile(order: Order) {
    this.displayFilePreview = true;
    console.log(this.displayFilePreview);
    this.order = order;
  }

  onItemClick(item, colum: Column) {
    const that = this;
    item.subitemsVisibles = true;
    this.showItems = true;
    setTimeout(() => {
      if (!that.elementInViewport($('.p-contextmenu-sub')[0])) {
        $('.p-contextmenu-sub').css('margin-left', '-186px');
        if (!that.elementInViewport($('.p-contextmenu-sub')[0])) {
          this.arrowRight = true;
          $('.fa-chevron-left').addClass('fa-chevron-right');
          $('.fa-chevron-right').removeClass('fa-chevron-left');
          $('.p-contextmenu-sub').css('margin-left', '32px');
        }
      }
    }, 1);
    if (!item.subitems) {
      switch (colum.productionStatusId) {
        case StatesOrdes.statusOnHold:
          this.nameActualColumn = StatesOrdes[StatesOrdes.statusOnHold];
          break;
        case StatesOrdes.statusInAction:
          this.nameActualColumn = StatesOrdes[StatesOrdes.statusInAction];
          break;
        case StatesOrdes.statusAdvanceNextProcess:
          this.nameActualColumn = StatesOrdes[StatesOrdes.statusAdvanceNextProcess];
          break;
      }
      this.showTotalizado = true;
      this.totalizedStatus = new Totalized();
      this.getTotalizedStatus(colum.productionStatusId);
    }
  }

  getTotalizedStatus(productionStatusId: number) {
    let data = {
      plantId: this.floorControl.plantId,
      processId: this.floorControl.processId,
      productionStatusId: productionStatusId
    };
    this.wmsService.getTotalizedOrderStatusPost(data)
      .subscribe(
        (response) => {
          if (response) {
            this.totalizedStatus = response.data;
          } else {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  viewMore(column: Column) {
    this.statusId = column.productionStatusId;
    switch (this.statusId) {
      case StatesOrdes.statusOnHold:
        this.start = this.quantityColumn1;
        this.quantity = this.quantityColumn1 + environment.pageLenghtCard;
        this.quantityColumn1 = this.quantity;
        break;
      case StatesOrdes.statusInAction:
        this.start = this.quantityColumn2;
        this.quantity = this.quantityColumn2 + environment.pageLenghtCard;
        this.quantityColumn2 = this.quantity;
        break;
      case StatesOrdes.statusAdvanceNextProcess:
        this.start = this.quantityColumn3;
        this.quantity = this.quantityColumn3 + environment.pageLenghtCard;
        this.quantityColumn3 = this.quantity;
        break;
    }
    this.getOrders(false, true);
  }

  onSubItemClick(item, column: Column) {
    if (!item.subitems) {
      this.orderItem = item;
    }
    this.sortOrder = "ProductionOrderId";
    switch (this.orderItem) {
      case "floor-control.states":
        this.sortOrder = "SemaphoreStatusId";
        break;
      case "floor-control.orderNumber":
        this.sortOrder = "ProductionOrderId";
        break;
      case "floor-control.code":
        this.sortOrder = "ProductId";
        break;
      case "floor-control.promisedDate":
        this.sortOrder = "PromisedDate";
        break;
      case "floor-control.quantity":
        this.sortOrder = "Quantity";
        break;
    }
    this.start = 0;
    this.quantity = environment.pageLenghtCard;
    this.statusId = column.productionStatusId;
    this.quantityColumn1 = environment.pageLenghtCard;
    this.quantityColumn2 = environment.pageLenghtCard;
    this.quantityColumn3 = environment.pageLenghtCard;

    this.getOrders(true, false);
  }

  public closeMenu() {
    if (this.board) {
      this.board.columns.forEach(columnBoard => {
        if (columnBoard.state != this.columnVisible) {
          columnBoard.menuVisible = false;
        }
      });
      if (!this.showItems) {
        this.items.forEach(item => {
          item.subitemsVisibles = false;
        });
      }
      this.columnVisible = '';
      this.showItems = false;
      this.orderItem = '';
    }
  }

  showMenu(event, column: Column) {
    const that = this;
    if (!this.showTotalizado && this.orderItem == '') {
      this.columnVisible = column.state;
      column.menuVisible = true;
      setTimeout(() => {
        if ($('.p-contextmenu')[0]) {
          const widthCard = $('.p-contextmenu').width();
          const scrollLeft = $('.board-wrapper').scrollLeft();
          $('.p-contextmenu').css('margin-left', (-scrollLeft - widthCard) + 'px');
          if (!that.elementInViewport($('.p-contextmenu')[0])) {
            if (!this.arrowRight) {
              $('.fa-chevron-right').addClass('fa-chevron-left');
              $('.fa-chevron-left').removeClass('fa-chevron-right');
              $('.arrow').css('left', '8px');
              $('.arrow').css('right', 'auto');
            }
            this.arrowRight = false;
          }
        }
      }, 1);
    }
  }

  elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth * 2;
    var height = el.offsetHeight;
    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= $('.board-wrapper').scrollLeft() &&
      (top + height) <= (window.pageYOffset + window.innerHeight) &&
      (left + width) <= ($('.board-wrapper').scrollLeft())
    );
  }

  //////////// change state ////////////////
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      if (event.previousContainer.id == StatesOrdes.statusOnHold.toString() && event.container.id == StatesOrdes.statusAdvanceNextProcess.toString()) {
        this.showAdvanceError = true;
        return;
      }
      if (event.previousContainer.id == StatesOrdes.statusAdvanceNextProcess.toString() && event.container.id == StatesOrdes.statusOnHold.toString()) {
        this.showAdvanceError = true;
        return;
      }

      ////abrir la lista de check
      if (event.previousContainer.id == StatesOrdes.statusOnHold.toString() && event.container.id == StatesOrdes.statusInAction.toString()) {
        this.getCheckListQuestions(event.item.data.productionOrderId, Number(event.previousContainer.id), Number(event.container.id));
        return;
      }

      switch (event.container.id) {
        case StatesOrdes.statusOnHold.toString():
          this.messageChangeOrder(event.item.data.productionOrderId, StatesOrdes.statusOnHold);
          break;
        case StatesOrdes.statusInAction.toString():
          this.messageChangeOrder(event.item.data.productionOrderId, StatesOrdes.statusInAction);
          break;
        case StatesOrdes.statusAdvanceNextProcess.toString():
          this.messageChangeOrder(event.item.data.productionOrderId, StatesOrdes.statusAdvanceNextProcess);
          break;
      }
      this.updateState(event.item.data.productionOrderId, Number(event.previousContainer.id), Number(event.container.id));
    }
  }

  messageChangeOrder(order: number, nextStatus: StatesOrdes, processName: string = '') {

    if (processName != '') {
      this.nameProcessNext = processName;
      this.showAdvanceNumberOrder = order.toString();
      this.nameStateNext = StatesOrdesNames[nextStatus];
    } else {
      this.showAdvanceNumberOrder = order.toString();
      this.nameStateNext = StatesOrdesNames[nextStatus];
    }
  }

  mapDataUpdateState(productionOrderId: number, previousStatusId: number, nextStatus: number) {
    return {
      userName: this.currentUserAplication.username,
      productionOrderId: productionOrderId,
      processId: this.floorControl.processId,
      previousStatusId: previousStatusId,
      nextStatusId: nextStatus
    };
  }

  updateState(productionOrderId: number, previousStatusId: number, nextStatus: number, isFinished: boolean = false) {
    var data = this.mapDataUpdateState(productionOrderId, previousStatusId, nextStatus);
    this.wmsService.updateStatePost(data)
      .subscribe(
        (response) => {
          if (response) {
            if (response.status) {

              var ProcessName = response.data;
              if (isFinished) this.messageChangeOrder(productionOrderId, StatesOrdes.statusOnHold, ProcessName);
              this.showAdvanceSuccessful = true;
            } else {
              this.showAdvanceFail = true;
            }
          }
        },
        (error) => {
          if (error.error.message.includes("The exchange time has expired")) {
            this.showAdvanceFail = true;
          }
          else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          }
        },
        () => { }
      );
  }

  previousState(order: Order, colum: Column) {
    switch (colum.productionStatusId) {
      case StatesOrdes.statusInAction:
        this.messageChangeOrder(order.productionOrderId, StatesOrdes.statusOnHold);
        this.updateState(order.productionOrderId, colum.productionStatusId, StatesOrdes.statusOnHold);
        break;
      case StatesOrdes.statusAdvanceNextProcess:
        this.messageChangeOrder(order.productionOrderId, StatesOrdes.statusInAction);
        this.updateState(order.productionOrderId, colum.productionStatusId, StatesOrdes.statusInAction);
        break;
    }
  }

  nextState(order: Order, colum: Column) {
    switch (colum.productionStatusId) {
      case StatesOrdes.statusOnHold:
        this.getCheckListQuestions(order.productionOrderId, colum.productionStatusId, StatesOrdes.statusInAction);
        break;
      case StatesOrdes.statusInAction:
        this.messageChangeOrder(order.productionOrderId, StatesOrdes.statusAdvanceNextProcess);
        this.updateState(order.productionOrderId, colum.productionStatusId, StatesOrdes.statusAdvanceNextProcess);
        break;
      case StatesOrdes.statusAdvanceNextProcess:
        this.getPaymentForProduction(order.productionOrderId, colum.productionStatusId, StatesOrdes.statusCompleted);        
        break;
    }
  }

  advanceOrder() {
    if (this.orderAdvance != "") {
      this.productionOrderId = this.orderAdvance;
      var data = this.mapData();
      this.wmsService.getProductionOrderPost(data)
        .subscribe(
          (response) => {
            if (response) {
              var data = response.data;
              if (data) {
                var StatusId = data[0].productionStatusId;
                switch (StatusId) {
                  case StatesOrdes.statusOnHold:
                    this.getCheckListQuestions(Number(this.orderAdvance), null, null);
                    break;
                  case StatesOrdes.statusInAction:
                    this.messageChangeOrder(Number(this.orderAdvance), StatesOrdes.statusAdvanceNextProcess);
                    this.updateState(Number(this.orderAdvance), null, null);
                    break;
                  case StatesOrdes.statusAdvanceNextProcess:
                    this.getPaymentForProduction(Number(this.orderAdvance), null, null);                    
                    break;
                }
              }
            }
          },
          (error) => {
            this.displayMoveOrder = false;
            this.productionOrderId = null;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
          () => { }
        );
      this.displayMoveOrder = false;
      this.productionOrderId = null;
      $('#txEnterOrder').val("");
    }
  }

  closeShowAdvanceSuccessful() {
    this.nameProcessNext = "";
    this.showAdvanceSuccessful = false;
    this.start = 0;
    this.quantity = environment.pageLenghtCard;
    this.statusId = null;
    this.getOrders(false, false);
  }

  closeShowAdvanceFail() {
    this.nameProcessNext = "";
    this.showAdvanceFail = false;
    this.start = 0;
    this.quantity = environment.pageLenghtCard;
    this.statusId = null;
    this.getOrders(false, false);
  }

  closeShowAdvanceError() {
    this.nameProcessNext = "";
    this.showAdvanceError = false;
    this.start = 0;
    this.quantity = environment.pageLenghtCard;
    this.statusId = null;
    this.getOrders(false, false);
  }

  getCheckListQuestions(productionOrderId: number, previousStatusId: number, nextStatus: number) {
    if (this.checkList.length > 0) {
      this.showCheckList = true;
      this.checkListOrderId = productionOrderId;
      const that = this;
      setTimeout(function()
              {
            $('.p-dialog-content').on("scroll", that.onScrollHandler({
              onStop: () => {
                $('.p-dialog-content').css('overflow-y', 'hidden');
                setTimeout(function()
                {
                  $('.p-dialog-content').css('overflow-y', 'scroll');
                },100);
              }
            }));
          },1000);
    }
    else {
      this.messageChangeOrder(productionOrderId, StatesOrdes.statusInAction);
      this.updateState(productionOrderId, previousStatusId, nextStatus);
    }
  }

  getPaymentForProduction(productionOrderId: number, previousStatusId: number, nextStatus: number) {
    if (this.paymentProducciont == true) {
      this.showDialogProduction = true;
      this.ProductionOrderId = productionOrderId;
    }
    else {      
      this.updateState(productionOrderId, previousStatusId, nextStatus,true);
    }
  }


  getDefaultValues(): void {
    this.floorControlForm.controls.plants.setValue(this.storageService.getFloorControl()["plantId"]);
    this.changePlant(this.storageService.getFloorControl()["plantId"]);
    this.floorControlForm.controls.process.setValue(this.storageService.getFloorControl()["processId"]);
    this.floorControlForm.controls.productionMastersSchedule.setValue(this.storageService.getFloorControl()["codeSchedule"]);
    this.floorControlForm.controls.productionMastersTurns.setValue(this.storageService.getFloorControl()["codeTurn"]);
    this.floorControlForm.controls.identification.setValue(this.storageService.getFloorControl()["identification"]);
  };

  resetDefaultValues(): void {
    this.floorControlForm.controls.process.reset();
    this.floorControlForm.controls.productionMastersSchedule.reset();
    this.floorControlForm.controls.productionMastersTurns.reset();
    this.floorControlForm.controls.identification.reset();
  };

  getPlant(): void {
    let data = {
      AuthorizedUserId: this.currentUserAplication.email,
    };
    this.productionMastersService.getPlantPost(data)
      .subscribe(
        (response) => {
          if (response) {
            this.plants = response.data;
            if (this.isOperator && this.plants.length == 1) {
              this.floorControlForm.controls.plants.setValue(this.plants[0].plantId);
              this.changePlant(this.plants[0].plantId);
            }
          } else {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  changePlant(event: any): void {
    this.process = [];
    this.getProcess(event);
    this.resetDefaultValues();
  }

  getProcess(plantId: number): void {
    const data = {
      authorizedUserId: this.currentUserAplication.email,
      plantId: plantId,
    };
    this.productionMastersService.getProcessPost(data)
      .subscribe(
        (response) => {
          if (response) {
            this.process = response.data;
            if (this.isOperator && this.process.length == 1) {
              this.floorControlForm.controls.process.setValue(this.process[0].processId);
            }
          } else {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  openConfiguration() {
    this.getDefaultValues();
    this.displayChangeConfiguration = true
  }

  continueProcess() {
    if (this.isOperator) {
      const data = {
        operatorId: this.floorControlForm.get('identification').value,
        ProcessId: this.floorControlForm.get('process').value,
      };
      this.productionMastersService.getProcessAndOperatorIdPost(data).subscribe(
        (response) => {
          if (response.status) {
            this.statusId = null;
            this.saveLocalStorage();
            this.getOrders(false, false);
            this.getCheckListItems();
            this.getPaymentProduction();            
            this.displayChangeConfiguration = false;
          } else {
            this.getCheckListItems();
            this.getPaymentProduction();
            this.displayDialogProcessOperator = true;
            return;
          }
        },
        (error) => {
          this.getCheckListItems();
          this.getPaymentProduction();
          this.displayDialogProcessOperator = true;
          return;
        });
    } else {
      this.statusId = null;
      this.displayChangeConfiguration = false;
      this.saveLocalStorage();
      this.getOrders(false, false);
      this.getCheckListItems();
      this.getPaymentProduction();
    }
  }

  closeCommentConfirmation() {
    this.displayDialogProcessOperator = false;
  }

  saveLocalStorage() {
    const data = {
      plantId: this.floorControlForm.get('plants').value,
      processId: this.floorControlForm.get('process').value,
      codeSchedule: this.floorControlForm.get('productionMastersSchedule').value,
      codeTurn: this.floorControlForm.get('productionMastersTurns').value,
      identification: this.floorControlForm.get('identification').value,
    }
    this.storageService.addFloorControl(data);
    this.floorControl = this.storageService.getFloorControl();
  }
}

export enum StatesOrdes {
  statusOnHold = 3, // pendientes por iniciar
  statusInAction = 4, // en ejecucion
  statusAdvanceNextProcess = 7, // finalizado
  statusCompleted = 8 // completado
}

export enum StatesOrdesNames {
  pending = 3, // pendientes por iniciar
  excecution = 4, // en ejecucion
  finalized = 7, // finalizado
  statusCompleted = 8 // completado
}

export class Board {
  constructor(public columns: Column[]) { }
}

export class Column {
  constructor(public state: string, public menuVisible: boolean, public orders: Order[], public canPreviousState: boolean, public productionStatusId: number) { }
}

export class Order {
  constructor(
    public rowId: string,
    public totalRecords: number,
    public totalFiltered: number,
    public productionOrderId: number,
    public productionStatusId: number,
    public orderId: number,
    public productId: string,
    public promisedDate: Date,
    public quantity: number,
    public semaphoreStatusId: number,
    public image: string
  ) { }
}

export class Detail {
  constructor(
    public productionOrderId: number = 0,
    public customerName: string = "",
    public productName: string = "",
    public orderType: string = "",
    public productId: string = "",
    public cutName: string = "",
    public subLineName: string = "",
    public qualityName: string = "",
    public warpId: string = "",
    public widthId: number = 0,
    public sizes: string = "",
    public unitMeasureId: string = "",
    public orderId: number = 0,
    public approvedDate: string = "",
    public customerOrderNumber: string = "",
    public bufferStatus: string = "",
    public rrcStart: string = "",
    public deliveryToDispatch: string = "",
    public dateRequired: string = "",
    public daysInProcess: number = 0,
    public totalsDays: number = 0,
  ) { }
}

export class Totalized {
  constructor(
    public ordersTotal: number = 0,
    public unitsTotal: number = 0,
    public metersTotal: number = 0,
    public equivalentMetersTotal: number = 0
  ) { }
}

export class Questions {
  constructor(
    public questionNumber: number = 0,
    public questionDescription: string = "",
    public answerGroupId: number = 0
  ) { }
}

export class CreateAuditResultChecklistDtos {
  constructor(
    public productionOrderId: number = 0,
    public processId: string = "",
    public questionNumber: number = 0,
    public answerGroupId: number = 0,
    public responseTypeId: string = "",
    public notes: string = "",
    public createdByUser: string = ""
  ) { }
}

export class CreateOrderRouteOperatorDto {
  constructor(
    public userName: string = "",
    public productionOrderId: number = 0,
    public processId: number = 0,
    public operatorId: number = 0
  ) { }
}

