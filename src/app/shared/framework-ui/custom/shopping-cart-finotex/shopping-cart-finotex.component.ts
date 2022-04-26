import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ProductDto } from 'src/app/shared/models/producto-dto';
import { CalendarModule } from '../../primeng/calendar/public_api';
import { DialogModule } from '../../primeng/dialog/public_api';
import { httpTranslateLoader } from '../../primeng/paginator/paginator';
import { ButtonFinotexModule } from '../button-finotex/button-finotex.component';
import { SearchSelectorFinotexModule } from '../search-selector/search-selector.component';
import { SharedService } from 'src/app/core/services/shared/shared.service';

@Component({
  selector: 'app-shopping-cart-finotex',
  template: `<div class="shopping-cart">
    <div class="shopping-cart-header">
      <div class="row">
        <div class="col-8 pl-0">
          {{ title }}
        </div>
        <div class="col-4 pr-0">
          <span class="checkbox-finotex">
            <input
              type="checkbox"
              class="pi p-checkbox"
              value="{{ product.productId }}"
              (change)="checkIfActive($event)"
            />
          </span>
        </div>
      </div>
    </div>

    <div class="shopping-cart-body">
      <div class="row">
        <div class="col-6 pr-1 pl-0">
          <div class="image-shopping-finotex">
            <img
              class="center"
              src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Zumba.png"
              alt="Card image cap"
              appImage
            />
          </div>
        </div>

        <div class="col-6 pl-1 pr-0">
          <div class="title-card-fonotex">
            {{ 'products.lblCustCode1' | translate }}:
          </div>

          <div class="title-card-sub-fonotex">
            {{ product_code }}
          </div>

          <div class="title-card-fonotex" *ngIf="size != ''">
            {{ 'products.lblSize' | translate }}:
          </div>

          <div class="title-card-sub-fonotex">
            {{ size }}
          </div>

          <div class="title-card-fonotex">
            {{ 'products.lblDate' | translate }}:
          </div>

          <div class="title-card-sub-fonotex">
            {{ date | date }}
          </div>

          <div class="title-card-fonotex" *ngIf="colour != ''">
            {{ 'products.lblColor' | translate }}:
          </div>

          <div class="title-card-sub-fonotex">
            {{ colour }}
          </div>
        </div>
      </div>
    </div>

    <div class="shopping-cart-footer">
      <div class="row">
        <div class="col-6 pl-0 text-center">
          <span class="checkbox-finotex-center">
            <a (click)="openModalProductDetail(product)" class="font-middle">
              {{ 'products.btnMoreDetails' | translate }}
            </a>
          </span>
        </div>

        <div class="col-6 pr-0 text-center">
          <app-button-finotex
            label="products.btnAddToCart"
            type="button"
            typeButton="primary"
            [typeSize]="false"
            (click)="openModalProductCart(product.productId)"
          ></app-button-finotex>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./shopping-cart-finotex.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShoppingCartComponentFinotex),
      multi: true,
    },
  ],
  host: {
    class: 'p-element',
  },
})
export class ShoppingCartComponentFinotex
  implements OnInit, ControlValueAccessor {
  @Input() title: string = '';
  @Input() product_code: string = '';
  @Input() size: string = '';
  @Input() date: string = '';
  @Input() colour: string = '';
  @Input() product: ProductDto = new ProductDto();

  @Output() clickEventDetail: EventEmitter<any> = new EventEmitter();
  @Output() clickEventCart: EventEmitter<any> = new EventEmitter();
  @Output() clickEventcheckbox: EventEmitter<any> = new EventEmitter();

  constructor() { }

  writeValue(obj: any): void { }

  registerOnChange(fn: any): void { }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  ngOnInit(): void {

  }

  openModalProductDetail(product: ProductDto) {
    this.clickEventDetail.emit(product);
  }

  openModalProductCart(productid: string | number) {
    this.clickEventCart.emit(productid);
  }

  checkIfActive(event: any) {
    this.clickEventcheckbox.emit(event);
  }
}

@Component({
  selector: 'app-shopping-cart-item-dialog-finotex',
  templateUrl: './shopping-cart-finotex.component.html',
  styleUrls: ['./shopping-cart-finotex.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'p-element',
  },
})
export class ShoppingCartItemsDialog implements OnInit, OnDestroy {
  isDialog$ = this.loadingService.isDialog$;

  registerFormRequireDate: FormGroup;
  displayRequiredDates = false;

  registerFormCart: FormGroup;
  currencyId: string = '';
  showPrice: boolean;
  currencyName: string = '';

  @Input() listProductCart: any[] = [];
  @Input() header: string = '';

  _listProductCart: any[] = [];
  customerService: any;
  listProductsCheckout = [];
  total: number = 0;

  constructor(
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private SharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getFormCart();
    this.getFormCartRequireDate();
  }

  public setDataCart(): void {
    this.registerFormCart.reset();
    this.items.clear();
    this.getListProductCartLocalStorage().forEach(
      (data: any, index: number) => {
        this.items.push(this.itemCartSet(data));
      }
    );
  }

  closeDialogFinotex(event: any) {
    this.loadingService.hideDialog();
  }

  removeProductCart(index: any): void {
    this.items.removeAt(index);
    this.storageService.addProductLocalStorage(
      this.registerFormCart.value.itemsCart
    );

    if (this.getListProductCartLocalStorage().length <= 0) {
      this.loadingService.hideDialog();
    }
  }

  calculatePrice(data: any, quantity: number, index: number) {
    var salesPreciRange = '0';
    data.customerProductPrice.forEach((item) => {
      var min = parseInt(item.lowerLimit);
      var max = parseInt(item.upperLimit);
      if (quantity >= min && quantity <= max) {
        salesPreciRange = item.salesPrice;
      } else {
        salesPreciRange = '0';
      }
    });

    this.calculateTotal();
    this.items.at(index).get('price').setValue(salesPreciRange);
    var subTotal = parseInt(salesPreciRange) * quantity;
    this.items.at(index).get('subtotal').setValue(subTotal);
    this.items.at(index).get('currencyName').setValue(this.currencyName);
    this.items.at(index).get('showPrice').setValue(this.showPrice);
    this.items.at(index).get('total').setValue(this.total);
  }

  keyboardInput(event: any, product: any, index: number) {
    if (parseInt(event) <= 0) {
      this.items.at(index).get('quantity').setValue(null);
    }
    this.calculatePrice(product, parseInt(event), index);
  }

  changeInputT(event: any) {
    this.storageService.addProductLocalStorage(
      this.registerFormCart.value.itemsCart
    );
    this.items.clear();
    this.getListProductCartLocalStorage().forEach(
      (data: any, index: number) => {
        this.items.push(this.itemCartSet(data));
      }
    );
  }

  changeInputFinotex(event: any) {
    this.storageService.addProductLocalStorage(
      this.registerFormCart.value.itemsCart
    );
    this.items.clear();
    this.validateRepeatedRequiredDate();
    this.getListProductCartLocalStorage().forEach(
      (data: any, index: number) => {
        this.items.push(this.itemCartSet(data));
      }
    );
  }

  validateRepeatedRequiredDate() {
    let items = this.getListProductCartLocalStorage();
    let validate = 0;

    items.forEach((x) => {
      items.forEach((y) => {
        if (x.customerProductCode == y.customerProductCode
          && x.sizes == y.sizes
          && x.referenceColor == y.referenceColor
          && x.locationDate == y.locationDate) {
          validate++;
        }
      });
    });

    return validate !== items.length;
  }

  getFormCartRequireDate() {
    return (this.registerFormRequireDate = this.formBuilder.group({
      dateRequire: [null, Validators.required],
    }));
  }

  getFormCart() {
    return (this.registerFormCart = this.formBuilder.group({
      itemsCart: this.formBuilder.array([], this.itemCart()),
    }));
  }

  private itemCart(): FormGroup {
    return this.formBuilder.group({
      quantity: [null, Validators.required, Validators.min(1)],
      locationDate: [null, Validators.required],
      customerProductCode: [null, Validators.nullValidator],
      sizes: [null, Validators.nullValidator],
      productName: [null, Validators.nullValidator],
      unitMeasure: [null, Validators.nullValidator],
      price: [null, Validators.nullValidator],
      subtotal: [null, Validators.nullValidator],
      referenceColor: [null, Validators.nullValidator],
      currencyName: [null, Validators.nullValidator],
      showPrice: [null, Validators.nullValidator],
      total: [null, Validators.nullValidator]
    });
  }

  private itemCartSet(data: any): FormGroup {
    let dateCart =
      data.locationDate == null ? null : new Date(data.locationDate);
    return this.formBuilder.group({
      quantity: [data.quantity, Validators.required],
      locationDate: [dateCart, Validators.required],
      customerProductCode: [data.customerProductCode, Validators.nullValidator],
      sizes: [data.sizes, Validators.nullValidator],
      productName: [data.productName, Validators.nullValidator],
      unitMeasure: [data.unitMeasure, Validators.nullValidator],
      customerProductPrice: [data.customerProductPrice, Validators.nullValidator],
      price: [data.price, Validators.nullValidator],
      subtotal: [data.subtotal, Validators.nullValidator],
      referenceColor: [data.referenceColor, Validators.nullValidator],
      currencyName: [data.currencyName, Validators.nullValidator],
      showPrice: [data.showPrice, Validators.nullValidator],
      total: [data.total, Validators.nullValidator]

    });
  }

  private itemCartSetRequireDate(data: any): FormGroup {
    return this.formBuilder.group({
      locationDate: [data, Validators.required],
    });
  }

  get items() {
    return this.registerFormCart.get('itemsCart') as FormArray;
  }
  public dataCustomer(data: any) {
    this.currencyId = data.currencyId;
    this.showPrice = data.showPrice;
    this.getCurrencyById(this.currencyId);
  }

  getCurrencyById(currencyId: string) {
    const body = { currencyId };
    this.SharedService.currencyGetById(body).subscribe((response) => {
      this.currencyName = response.data.centsName;
    });
  }

  getListProductCartLocalStorage(): any[] {
    return this.storageService.getProductLocalStorage() == null
      ? []
      : this.storageService.getProductLocalStorage();
  }

  redirecCheckout(event: any) {
    this.router.navigate(['/home/product_checkout']);
  }


  calculateTotal() {
    var itemSubtotal: number = 0;
    var sum: number = 0;
    this.listProductCart = this.storageService.getProductLocalStorage() == null ? [] : this.storageService.getProductLocalStorage();
    this.listProductCart.forEach(element => {
      if (element.subtotal > 0) {
        itemSubtotal = element.subtotal;
        sum = itemSubtotal + sum;
      }
    });
    this.total = sum;
  }

  openDateRequiredDialog(): void {
    this.loadingService.hideDialog();
    this.displayRequiredDates = true;
    this.registerFormRequireDate.reset();
  }

  dateRequiredCancel() {
    this.loadingService.showDialog();
    this.displayRequiredDates = false;
  }

  dateRequiredAccept() {
    this.items.controls.forEach((data: any, index: number) => {
      this.items.at(index).get('locationDate').setValue(this.registerFormRequireDate.get("dateRequire").value);
      this.items.at(index).get('locationDate').updateValueAndValidity();
    });
    this.changeInputFinotex(null);
    this.dateRequiredCancel();
  }

  ngOnDestroy(): void { }
}

@NgModule({
  declarations: [ShoppingCartComponentFinotex, ShoppingCartItemsDialog],
  exports: [ShoppingCartComponentFinotex, ShoppingCartItemsDialog],
  imports: [
    CommonModule,
    ButtonFinotexModule,
    DialogModule,
    SearchSelectorFinotexModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
})
export class ShoppingCartModule { }
