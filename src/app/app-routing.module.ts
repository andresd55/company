import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CodebarComponent } from './components/floorcontrol/codebar/codebar.component';
import { FloorControlLoginComponent } from './components/floorcontrol/floor-control-login/floor-control-login.component';
import { OrdersListComponent } from './components/floorcontrol/orders-list/orders-list.component';
import { ResourceTimeComponent } from './components/floorcontrol/resource-time/resource-time.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilesComponent } from './components/login/profiles/profiles.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'profiles_roles', component: ProfilesComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'floorcontrol', component: FloorControlLoginComponent },
      { path: 'orders', component: OrdersListComponent },
      { path: 'codebar', component: CodebarComponent },
      { path: 'resourcetime', component: ResourceTimeComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
