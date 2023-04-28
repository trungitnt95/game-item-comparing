import {Component, Input, OnInit} from '@angular/core';
import {AngularFirebaseService} from "../../../angular-firebase.service";
import {units} from "../../detail-schedule/detail-schedule.component";

@Component({
  selector: 'app-sick-detail',
  templateUrl: './sick-detail.component.html',
  styleUrls: ['./sick-detail.component.scss']
})
export class SickDetailComponent implements OnInit {

  @Input()
  sickKey: string|undefined;


  @Input()
  sickName: string|undefined;
  description: string|undefined;

  nutriName: string|undefined;

  min: number = -1.0;
  max: number = -1.0;
  min_sick_key: string|undefined;
  max_sick_key: string|undefined;

  nutrisList: any = Object.keys(units);
  nutrisInSick: any[] = [];


  constructor(private afService: AngularFirebaseService) {
    // console.log(this.nutrisList);
  }

  ngOnInit(): void {
    if (this.sickKey) {
      this.afService.findAllSnapShots('master-data/nutris-sicks')
        .subscribe((sickNutriData) => {
          // console.log(sickNutriData);
          this.nutrisInSick = sickNutriData;
        });
    }
  }


  saveNutriToSick() {
    this.afService.saveWithRandomKey('master-data/nutris-sicks/' + this.nutriName,
      {
        description: this.description,
        min: this.min,
        max: this.max,
        min_sick_key: this.min > -1.0 ? this.sickKey : "",
        max_sick_key: this.max > -1.0 ? this.sickKey : ""
      });
  }

  getExit(nutriName: any) {
    let jsonPayload = nutriName.payload.toJSON();
    console.log(jsonPayload);
    for (let attr of Object.keys(jsonPayload)) {
      if (jsonPayload[attr].min_sick_key === this.sickKey)
        return nutriName.key + ' # min=' + jsonPayload[Object.keys(jsonPayload)[0]].min + ':max=' + jsonPayload[Object.keys(jsonPayload)[0]].max;
    }
    return '';
  }
}
