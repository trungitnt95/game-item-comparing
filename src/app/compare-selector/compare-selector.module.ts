import {NgModule} from "@angular/core";
import {CompareSelectorComponent} from "./compare-selector.component";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@NgModule({
  declarations: [
    CompareSelectorComponent
  ],
  imports: [
    FormsModule,
    NgForOf,
  ],
  exports: [
    CompareSelectorComponent
  ]
})
export class CompareSelectorModule {}
