import { Component, OnInit } from '@angular/core';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Finotex';
  
  ngOnInit(): void {
    console.log(`Version APP: ${packageJson.version}`);
  }

}
