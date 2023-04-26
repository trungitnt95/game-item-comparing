import {Component} from '@angular/core';
import {AngularFirebaseService} from "./angular-firebase.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public afService: AngularFirebaseService) {
  }

  logout() {
    this.afService.logout();
  }
}
