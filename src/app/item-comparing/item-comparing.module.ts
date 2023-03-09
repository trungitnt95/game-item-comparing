import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemComparingRoutingModule } from './item-comparing-routing.module';
import { ItemComparingComponent } from './item-comparing.component';
import {CompareSelectorModule} from "../compare-selector/compare-selector.module";
import { BothItemValueComponent } from './both-item-value/both-item-value.component';


@NgModule({
  declarations: [
    ItemComparingComponent,
    BothItemValueComponent
  ],
  imports: [
    CommonModule,
    ItemComparingRoutingModule,
    CompareSelectorModule
  ]
})
export class ItemComparingModule { }
