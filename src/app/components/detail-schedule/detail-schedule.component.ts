import {Component, Input} from '@angular/core';
import {AngularFirebaseService} from "../../counter/angular-firebase.service";
import {Group} from "../../model/group.enum";

@Component({
  selector: 'app-detail-schedule',
  templateUrl: './detail-schedule.component.html',
  styleUrls: ['./detail-schedule.component.scss']
})
export class DetailScheduleComponent {

  @Input('selectedSchedule')
  selectedScheduled: any;
  isShowAddingFood = false;
  selectedGroup = Group.RICE;
  selectedFoodId: string|undefined;
  listFood: any[] = [];
  Group = Group;
  numberOf100Gram = 1;

  constructor(private afService: AngularFirebaseService) {
    console.log(this.selectedScheduled);
  }

  showAddFoodPanel() {
    // clear

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
}
