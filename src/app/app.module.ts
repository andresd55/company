import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AplicationModule } from './components/aplication/aplication.module';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, AplicationModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
