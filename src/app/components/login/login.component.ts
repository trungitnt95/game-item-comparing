import { Component } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = "";
  password = "";
  isLoading = true;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  login() {
    this.afAuth
      .signInWithEmailAndPassword(this.username, this.password)
      .then((result) => {
        // this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
}
