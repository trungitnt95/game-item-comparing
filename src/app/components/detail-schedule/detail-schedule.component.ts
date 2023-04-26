import {Component, Input, OnInit} from '@angular/core';
import {AngularFirebaseService} from "../../angular-firebase.service";
import {Group} from "../../model/group.enum";

@Component({
  selector: 'app-detail-schedule',
  templateUrl: './detail-schedule.component.html',
  styleUrls: ['./detail-schedule.component.scss']
})
export class DetailScheduleComponent implements OnInit {

  @Input('selectedSchedule')
  selectedScheduled: any;
  isShowAddingFood = false;
  selectedGroup = Group.RICE;
  selectedFoodId: string|undefined;
  listFood: any[] = [];
  Group = Group;
  numberOf100Gram = 1;
  selectedFoodInScheduled: any[] = [];

  nutrisFromMaster: number = 0;
  result: any = null;
  nutriAttributeNames: string[] = [];

  constructor(private afService: AngularFirebaseService) {
  }

  ngOnInit(): void {
    console.log(this.selectedScheduled);
    if (this.selectedScheduled) {
      this.afService.findAll(this.afService.loggedInUID + '/schedule_food/' + this.selectedScheduled.key)
        .subscribe((data) => {
          if (data) {
            this.selectedFoodInScheduled = data;
            console.log(this.selectedFoodInScheduled);
          }
        });
    }
  }



  showAddFoodPanel() {
    // clear

    this.selectedFoodId = undefined;
    //show
    this.isShowAddingFood = true;
  }

  hideAddingFood() {
    this.isShowAddingFood = false;
  }

  addSelectedFoodToSchedule() {
    this.isShowAddingFood = false;
    this.afService.saveWithRandomKey(this.afService.loggedInUID + '/schedule_food/' + this.selectedScheduled.key,
      {
        foodKey: this.selectedFoodId,
        name: this.listFood.filter(t => t.key ===this.selectedFoodId).pop().name,
        numberOf100Gram: this.numberOf100Gram
      })?.then(() => {
        this.selectedFoodId = undefined;
    });
  }

  onSelectedGroup() {
    console.log(this.selectedGroup);
    this.listFood = [];
    this.afService.findAll('/master-data/groups/' + this.selectedGroup)
      .subscribe((foods) => {
        console.log(foods);
        this.listFood = foods;
      });
  }

  onSelectedFood() {
    console.log(this.selectedFoodId);
  }

  startAnalyze() {

    this.result = null;
    this.nutrisFromMaster = 0;
    //fetch nutris master data
    this.selectedFoodInScheduled.forEach((f) =>{
      this.afService.findByKey('master-data/nutris', f.foodKey)
        .subscribe((n) => {
          if (this.result === null) {
            this.result = n;
            this.nutriAttributeNames = [];
            for (let a in n) {
              this.nutriAttributeNames.push(a);
            }
          } else {
            for (let a in n) {
              if (this.result[a] === -1 && n[a] > -1) {
                this.result[a] = n[a] * f.numberOf100Gram;
              } else if (this.result[a] > -1 && n[a] > -1) {
                this.result[a] += n[a] * f.numberOf100Gram;
              }
            }
          }
          this.nutrisFromMaster++;
        });
    });

  }

  calculate() {
    console.log(this.nutrisFromMaster);

    console.log(this.result);
  }
}
