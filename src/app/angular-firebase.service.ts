import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "@angular/fire/compat/database";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {DatabaseQuery} from "@angular/fire/compat/database/interfaces";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AngularFirebaseService {

  // private listPathRefs: AngularFireList<any>;
  // private objectPathRefs: AngularFireObject<any>;
  isLoggedIn = false;
  loggedInUID: string|undefined;


  isAlreadyUpdatedHomePageView = false;
  isAlreadyUpdatedComparePageView = false;

  constructor(private afAuth: AngularFireAuth, private fireDb: AngularFireDatabase) {
    // this.afAuth.authState.subscribe((user) => {
    //   console.log(user);
    //   this.isLoggedIn = user !== null;
    // });
  }

  logout() {
    this.afAuth.signOut().then(() => this.loggedInUID = undefined);
  }

  /**
   * Save new object at path/keyOrIndex, the content will be overridden if exist one  .
   * @param path
   * @param keyOrIndex
   * @param obj
   */
  save(path: string, keyOrIndex: string, obj: Object): void {
    if (!this.loggedInUID) return;
    const promise = this.fireDb.object(path + '/' + keyOrIndex).set(obj);
    // this.afterHandleRequest(promise);
  }

  /**
   * Push object to the list of path, a key will be generated.
   * @param path
   * @param obj
   */
  saveWithRandomKey(path: string, obj: Object) {
    if (!this.loggedInUID) return;
    return this.fireDb.list(path).push(obj);
  }

  /**
   * Update object at path/keyOrIndex with object with fields and its values.
   * @param path
   * @param keyOrIndex
   * @param obj
   */
  update(path: string, keyOrIndex: string, obj: any) {
    this.fireDb.object(path + '/' + keyOrIndex).update(obj);
  }

  /**
   * Remove object of path/keyOrIndex.
   * If there is no object in this path, this path will be deleted as well.
   * @param path
   * @param keyOrIndex
   */
  delete(path: string, keyOrIndex: string) {
    this.deleteAll(path + '/' + keyOrIndex);
  }

  deleteAll(path: string) {
    this.fireDb.object(path).remove();
  }

  findByKey(path: string, key: string): Observable<any> {
    return this.fireDb.object(path +  '/' + key).valueChanges();
  }

  findAll(path: string): Observable<any>  {
    if (!this.loggedInUID) return new Observable<any>();
    return this.fireDb.list(path).valueChanges();
  }
  findAllSnapShots(path: string): Observable<any>  {
    if (!this.loggedInUID) return new Observable<any>();
    return this.fireDb.list(path).snapshotChanges();
  }

  getQuery(path: string): DatabaseQuery {
    return this.fireDb.list(path).query;
  }

  static whereKeyEqTo(query: DatabaseQuery, condition: string): DatabaseQuery {
    return query.orderByKey().equalTo(condition);
  }
  static whereColumnEqTo(query: DatabaseQuery, columnPath:string, condition: string|number): DatabaseQuery {
    return query.orderByChild(columnPath).equalTo(condition);
  }
  static whereColGrOrEqTh(query: DatabaseQuery, columnPath:string, condition: number): DatabaseQuery {
    return query.orderByChild(columnPath).startAt(condition);
  }
  static whereColGrTh(query: DatabaseQuery, columnPath:string, condition: number): DatabaseQuery {
    return query.orderByChild(columnPath).startAfter(condition);
  }
  static whereColLesOrEqTh(query: DatabaseQuery, columnPath:string, condition: number): DatabaseQuery {
    return query.orderByChild(columnPath).endAt(condition);
  }
  static whereColLesTh(query: DatabaseQuery, columnPath:string, condition: number): DatabaseQuery {
    return query.orderByChild(columnPath).endBefore(condition);
  }
  static limitFirst(query: DatabaseQuery, limitNumber: number): DatabaseQuery {
    return query.limitToFirst(limitNumber);
  }
  static limitLast(query: DatabaseQuery, limitNumber: number): DatabaseQuery {
    return query.limitToLast(limitNumber);
  }

  private afterHandleRequest(promise: Promise<void>) {
    promise.then(() => {

    })
    .catch((reason) => {
      console.log(reason);
    })
    .finally(() => {

    });
  }

  // updateHomePageView(): void {
  //   if (!environment.production) {
  //     return;
  //   }
  //   this.fireDb.object('counter/home-page').valueChanges().subscribe((val: any) => {
  //     if (!this.isAlreadyUpdatedHomePageView) {
  //       console.log('viewed on any page + 1 = ' + (val.value + 1));
  //       this.isAlreadyUpdatedHomePageView = true;
  //       // this.listPathRefs.update('home-page', {value: val.value + 1});
  //     }
  //   });
  // }

  // updateComparePageView(): void {
  //   if (!environment.production) {
  //     return;
  //   }
  //   this.fireDb.object('counter/compare-page').valueChanges().subscribe((val: any) => {
  //     if (!this.isAlreadyUpdatedComparePageView) {
  //       console.log('viewed on compare page + 1 = ' + (val.value + 1));
  //       this.isAlreadyUpdatedComparePageView = true;
  //       // this.listPathRefs.update('compare-page', {value: val.value + 1});
  //     }
  //   });
  // }

  example () {
    // this.crudService.save("/counter/test", '21',[{ name: "hello", age : 12},{ name: "hello", age : 12}]);
    // this.crudService.save("/counter/test", '23',{ name: "hello", age : 12});
    // this.crudService.saveWithRandomKey("/counter/test",{ name: "hello", age : 12});
    // this.crudService.update("/counter/test", 21,{ name: "hello2"});
    // this.crudService.delete("/counter/test", 21);
    // this.crudService.findByKey("/counter/test", '23').subscribe((res) => {
    //   console.log(res);
    // });
    // this.crudService.findAll("/counter/test").subscribe((res) => {
    //   console.log(res);
    // });
    // CrudService.whereKeyEqualTo(this.crudService.getQuery("/counter/test"), '23')
    //   .get().then((res) => console.log(res.val()));
    // CrudService.whereColumnEqualTo(this.crudService.getQuery("/counter/test"), 'age', 16)
    //   .get().then((res) => console.log(res.val()));
    // CrudService.whereColumnGreaterThan(this.crudService.getQuery("/counter/test"), 'age', 17)
    //   .get().then((res) => console.log(res.val()));
    // CrudService.whereColLesOrEqTh(this.crudService.getQuery("/counter/test"), 'age', 16)
    //   .get().then((res) => console.log(res.val()));
  }
}
