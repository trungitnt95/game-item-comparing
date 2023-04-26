import {Component, OnInit} from '@angular/core';
import {AngularFirebaseService} from "../../counter/angular-firebase.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  selectedSickGroup: string = 'PHO_BIEN';
  isShowAddingSick: boolean = false;
  sickName: string = "";
  sicksByGroup: any[] = [];

  selectedSick: any;
  constructor(private afService: AngularFirebaseService) {
  }
  onSelectedSickGroup() {
    this.sicksByGroup = [];
    this.afService.findAllSnapShots('master-data/sicks/' + this.selectedSickGroup)
      .subscribe((snapshots) => {
        for (let sn of snapshots) {
          let o = sn.payload.toJSON();
          o.key = sn.key;
          this.sicksByGroup.push(o);
        }
      });
  }

  saveSickNameToGroup() {
    this.isShowAddingSick = false;
    this.afService.saveWithRandomKey('master-data/sicks/' + this.selectedSickGroup,
      {
        sickName: this.sickName
      });
  }

  ngOnInit(): void {
    this.onSelectedSickGroup();
  }

  hideSaveSickName() {
    this.isShowAddingSick = false;
  }

  isShowAddingSickName() {
    this.isShowAddingSick = true;
    this.sickName = "";
  }

  showDetailSick(sickKey: string, sickName: string) {
    if (sickKey) {
      this.selectedSick = {
        key: sickKey,
        name: sickName
      }
    } else {
      this.selectedSick = undefined;
    }
  }
}
