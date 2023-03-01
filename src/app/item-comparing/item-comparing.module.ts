import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemComparingRoutingModule } from './item-comparing-routing.module';
import { ItemComparingComponent } from './item-comparing.component';


@NgModule({
  declarations: [
    ItemComparingComponent
  ],
  imports: [
    CommonModule,
    ItemComparingRoutingModule
  ]
})
export class ItemComparingModule { }
