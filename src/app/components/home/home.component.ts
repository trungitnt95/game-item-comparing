import {Component} from '@angular/core';
import {Gender} from "../../model/gender.enum";
import {Age} from "../../model/age.enum";
import {AngularFirebaseService} from "../../angular-firebase.service";
import {ScheduleType} from "../../model/schedule_type.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isShowAddingSchedulePanel = false;
  scheduleName = "";
  gender = Gender.MAN;
  age = Age.ADULT;
  type = ScheduleType.DAY;

  schedules: any[] = [];

  selectedScheduled: any;

  constructor(private afService: AngularFirebaseService) {
    this.afService.findAllSnapShots(this.afService.loggedInUID + '/' + 'schedules').subscribe((data) => {
      this.schedules = [];
      for (const item of data) {
        let data1 = item.payload.toJSON();
        data1.key = item.key;
        // console.log(data1);
        this.schedules.push(data1);
      }
    });
  }

  showAddSchedulePanel() {
    // clear previous data
    this.scheduleName = "";
    this.gender = Gender.MAN;
    this.age = Age.ADULT;
    // show
    this.isShowAddingSchedulePanel = true;
  }

  saveNewSchedule() {
    this.afService.saveWithRandomKey(this.afService.loggedInUID + '/' + 'schedules',
      {
        type: this.type,
        scheduleName: this.scheduleName,
        age: this.age,
        gender: this.gender
      });
    this.isShowAddingSchedulePanel = false;
  }

  noNewSchedule() {
    this.isShowAddingSchedulePanel = false;
  }

  onClickedSchedule(scheduleKey: any) {
    // console.log(scheduleKey);
    this.selectedScheduled = scheduleKey;
  }

  isNotScheduleValid(): boolean {
    return !this.scheduleName || !this.age || !this.type || !this.gender;
  }

  onDeleteSchedule(scheduleKey: string, scheduleName: string) {
    if (confirm('Are you sure to delete the schedule ' + scheduleName + '?')) {
      this.selectedScheduled = undefined;
      this.afService.delete(this.afService.loggedInUID + '/schedule_food', scheduleKey)
        .then(() => {
          this.afService.delete(this.afService.loggedInUID + '/schedules', scheduleKey);
        });
    }
  }
}
