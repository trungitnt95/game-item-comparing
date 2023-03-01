import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'item-comparing',
    loadChildren: () => import('./item-comparing/item-comparing.module').then(m => m.ItemComparingModule)
  },
  {
    path: 'item-detail', loadChildren: () => import('./item-detail/item-detail.module').then(m => m.ItemDetailModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
