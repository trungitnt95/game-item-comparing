import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {CompareSelectorModule} from "./compare-selector/compare-selector.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    FormsModule,
    CompareSelectorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
