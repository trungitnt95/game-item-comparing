import {Component} from '@angular/core';
import {CountService} from "./counter/count.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private countService: CountService) {
    this.countService.updateHomePageView();
  }
}
