import {Component, Input, OnInit} from '@angular/core';
import {AngularFirebaseService} from "../../../angular-firebase.service";

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


  constructor(private afService: AngularFirebaseService) {
  }

  ngOnInit(): void {
    if (this.sickKey) {
      this.afService.findByKey('master-data/nutris-sicks', this.sickKey)
        .subscribe((sickNutriData) => {
          console.log(sickNutriData);
          if (sickNutriData) {
            this.description = sickNutriData.description;
            this.nutriName = sickNutriData.nutriName;
            this.min = sickNutriData.min;
            this.max = sickNutriData.max;
            this.min_sick_key = sickNutriData.min_sick_key;
            this.max_sick_key = sickNutriData.max_sick_key;
          }
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
}
