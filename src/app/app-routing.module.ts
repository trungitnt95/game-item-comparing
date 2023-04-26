import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {AuthGuard} from "./guard/auth.guard";
import {AdminComponent} from "./components/admin/admin.component";

const routes: Routes = [
  {
  //   path: 'item-comparing',
  //   loadChildren: () => import('./item-comparing/item-comparing.module').then(m => m.ItemComparingModule)
  // },
  // {
  //   path: 'item-detail', loadChildren: () => import('./item-detail/item-detail.module').then(m => m.ItemDetailModule)

    path: 'login', component: LoginComponent
  },{
    path: '', component: HomeComponent, canActivate: [AuthGuard]
  },{
    path: 'home', component: HomeComponent, canActivate: [AuthGuard]
  },{
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
