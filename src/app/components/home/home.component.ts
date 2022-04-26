import { Component, OnInit, ElementRef, DoCheck } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, DoCheck {

  constructor(
    private elementRef: ElementRef,
    private storageService: StorageService) { }

  ngDoCheck(): void {
    if (this.storageService.getUser() == null) {
      this.storageService.logoutUser();
    }
  }

  ngOnInit(): void {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../../../assets/js/template.js";
    this.elementRef.nativeElement.appendChild(script);
  }
}
