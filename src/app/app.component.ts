import {Component} from '@angular/core';
import {CrudService} from "./counter/crud.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private crudService: CrudService) {

  }
}
