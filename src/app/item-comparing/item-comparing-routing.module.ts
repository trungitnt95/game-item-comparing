import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComparingComponent } from './item-comparing.component';

const routes: Routes = [
  {
    path: ':groupId/:itemId1/:itemId2', component: ItemComparingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemComparingRoutingModule { }
