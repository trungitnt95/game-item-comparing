import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CountService {
  isAlreadyUpdatedHomePageView = false;
  isAlreadyUpdatedComparePageView = false;

  private readonly counterPathRefs: AngularFireList<any>;
  constructor(private fireDb: AngularFireDatabase) {
    this.counterPathRefs = this.fireDb.list('/counter');
  }

  updateHomePageView(): void {
    if (!environment.production) {
      return;
    }
    this.fireDb.object('counter/home-page').valueChanges().subscribe((val: any) => {
      if (!this.isAlreadyUpdatedHomePageView) {
        console.log('viewed on any page + 1 = ' + (val.value + 1));
        this.isAlreadyUpdatedHomePageView = true;
        this.counterPathRefs.update('home-page', {value: val.value + 1});
      }
    });
  }

  updateComparePageView(): void {
    if (!environment.production) {
      return;
    }
    this.fireDb.object('counter/compare-page').valueChanges().subscribe((val: any) => {
      if (!this.isAlreadyUpdatedComparePageView) {
        console.log('viewed on compare page + 1 = ' + (val.value + 1));
        this.isAlreadyUpdatedComparePageView = true;
        this.counterPathRefs.update('compare-page', {value: val.value + 1});
      }
    });
  }
}
