import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Component({
  selector: 'app-codebar',
  templateUrl: './codebar.component.html',
  styleUrls: ['./codebar.component.css']
})
export class CodebarComponent implements OnInit {

  title = 'angular-qrscanner';
  qrResultString: string;
  availableDevices!: MediaDeviceInfo[];
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODABAR
  ];
  deviceCurrent!: MediaDeviceInfo;
  deviceSelected!: string;

  hasDevices!: boolean;
  hasPermission!: boolean;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  


  ngOnInit() {
        
    }

    onCodeResult(resultString: string) {
      console.log(resultString);
      alert(resultString);
    }

    clearResult(): void {
      this.qrResultString = null;
    }
  
    onCamerasFound(devices: MediaDeviceInfo[]): void {
      console.log(devices);
      this.availableDevices = devices;
      this.hasDevices = Boolean(devices && devices.length);
    }
  
    onDeviceSelectChange(selected: string) {
      console.log(selected);
      const selectedStr = selected || '';
      if (this.deviceSelected === selectedStr) { return; }
      this.deviceSelected = selectedStr;
      const device = this.availableDevices.find(x => x.deviceId === selected);
      this.deviceCurrent = device || undefined;
    }
  
    onDeviceChange(device: MediaDeviceInfo) {
      console.log(device);
      const selectedStr = device?.deviceId || '';
      if (this.deviceSelected === selectedStr) { return; }
      this.deviceSelected = selectedStr;
      this.deviceCurrent = device || undefined;
    }
  
    openFormatsDialog() {
      const data = {
        formatsEnabled: this.formatsEnabled,
      };
  
      // this._dialog
      //   .open(FormatsDialogComponent, { data })
      //   .afterClosed()
      //   .subscribe(x => {
      //     if (x) {
      //       this.formatsEnabled = x;
      //     }
      //   });
    }
  
    onHasPermission(has: boolean) {
      console.log(has);
      this.hasPermission = has;
    }
  
    openInfoDialog() {
      const data = {
        hasDevices: this.hasDevices,
        hasPermission: this.hasPermission,
      };
  
      // this._dialog.open(AppInfoDialogComponent, { data });
    }
  
    onTorchCompatible(isCompatible: boolean): void {
      console.log(isCompatible);
      this.torchAvailable$.next(isCompatible || false);
    }
  
    toggleTorch(): void {
      this.torchEnabled = !this.torchEnabled;
    }
  
    toggleTryHarder(): void {
      this.tryHarder = !this.tryHarder;
    }

}
