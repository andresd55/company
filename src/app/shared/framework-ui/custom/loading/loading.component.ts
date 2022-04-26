import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

@Component({
  selector: 'app-loading',
  template: ` <div class="overlay" *ngIf="isLoading$ | async">
                <div class="lds-roller">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>`,
  styleUrls: ['./loading.component.css'],
  host: {
    'class': 'p-element'
  }
})
export class LoadingComponent {

  isLoading$ = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService) { }

}

@NgModule({
  imports: [CommonModule],
  exports: [LoadingComponent],
  declarations: [LoadingComponent]
})
export class LoadingModule { }
