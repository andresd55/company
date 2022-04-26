import { AfterContentInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterContentInit {

  public listMenu: any = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.menu();
  }

  menu() {
    this.listMenu = [
      {
        label: "menu.Orders",
        icon: "fa fa-truck",
        subMenu: [
          {
            label: "floor-control.floor-control",
            rute: "floorcontrol"
          }
        ]
      }
    ];
  }
}
