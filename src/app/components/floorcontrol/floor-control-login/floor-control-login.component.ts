import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductionMastersService } from 'src/app/core/services/productionMasters/production-masters.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { RoleProfileInternal } from 'src/app/shared/constant/roleProfile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-floor-control-login',
  templateUrl: './floor-control-login.component.html',
  styleUrls: ['./floor-control-login.component.css'],
  providers: [MessageService]
})
export class FloorControlLoginComponent implements OnInit {
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'floor-control.floor-control', url: '/home/floorcontrol', current: true },
  ];

  floorControlForm!: FormGroup;
  plants = [];
  process = [];
  language = this.storageService.getLanguage();
  productionMastersSchedule = this.language == "es" ? environment.productionMastersScheduleEs : environment.productionMastersScheduleEn;
  productionMastersTurns = this.language == "es" ? environment.productionMastersTurnsES : environment.productionMastersTurnsEn;
  isOperator = this.storageService.getProfiles().role == RoleProfileInternal.FOPS_COMPANY_OPERADORPISO ? true : false;
  displayDialogProcessOperator = false;
  currentUserAplication: any;
  displayScanner = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    private productionMastersService: ProductionMastersService,
    private storageService: StorageService
  ) { }


  ngOnInit(): void {
    this.currentUserAplication = this.storageService.getUser();  
    console.log(this.currentUserAplication);
    this.getForm();
    this.getPlant();
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

  continueProcess() {
    if (this.isOperator) {

      const data = {
        operatorId: this.floorControlForm.get('identification').value,
        ProcessId: this.floorControlForm.get('process').value,
      };

      this.productionMastersService.getProcessAndOperatorIdPost(data).subscribe(
        (response) => {
          if (response.status) 
          {
            this.saveLocalStorage();
            this.router.navigate(['home/orders']);      
          }else
          {
            this.displayDialogProcessOperator = true;
            return;
          }
        },
        (error) => {
          this.displayDialogProcessOperator = true;
          return;
        });
    }else
    {
      this.saveLocalStorage();
      this.router.navigate(['home/orders']);
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
  }

  openScanner()
  {
    this.displayScanner = true;
  }

}