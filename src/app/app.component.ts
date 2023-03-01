import {AfterViewInit, Component} from '@angular/core';
import {data} from './skyrim.data.constant';

export enum SCREEN_MODE {
  LIST,
  COMPARE,
  DETAIL
}
export enum SKYRIM_GROUP {
  HELMET,
  GOO2
}

export class Item {
  id: string | undefined;
  group: string | undefined;
  name: string | undefined;
  value: string | undefined;
  armor: string | undefined;
  weight: string | undefined;
  class: string | undefined;
  type: string | undefined;
  slot: string | undefined;
  damage: string | undefined;
  level: string | undefined;
  effect: string | undefined;
  perl: string | undefined;
  imgUrl: string | undefined;
  upgMaterial: string | undefined;

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  dataList = data;
  title = 'game-item-comparing';
  SCREEN_MODE = SCREEN_MODE;
  currentMode = SCREEN_MODE.LIST;

  SKYRIM_GROUP = SKYRIM_GROUP;
  selectedGroup: SKYRIM_GROUP;
  // HELMET
  selectedGroupData = [];

  selectedItemID1 = null;
  selectedItemID2 = null;

  constructor() {
    const href = window.location.href;
    if (href.includes('/item-comparing') ) {
      this.currentMode = SCREEN_MODE.COMPARE;
    } else if (href.includes('/item-detail')) {
      this.currentMode = SCREEN_MODE.DETAIL;
    } else {
      this.currentMode = SCREEN_MODE.LIST;
    }
    this.selectedGroup = SKYRIM_GROUP.HELMET;
    if (this.currentMode === SCREEN_MODE.LIST) {
      this.prepareItemInGroup(SKYRIM_GROUP.HELMET);
    }
  }

  ngAfterViewInit(): void {
  }

  prepareItemInGroup(group: SKYRIM_GROUP) {
    this.selectedGroupData = data.filter((t: Item) => t.group === SKYRIM_GROUP[group]);
    console.log(this.selectedGroupData);
  }

  changeMode(selectedMode: SCREEN_MODE) {
    this.currentMode = selectedMode;
  }

  changeGroup(selecedGroup: SKYRIM_GROUP) {
    this.selectedGroup = selecedGroup;
    this.selectedItemID1 = null;
    this.selectedItemID2 = null;
    this.prepareItemInGroup(selecedGroup);
  }

  showSelectedItem1() {
  }
  showSelectedItem2() {
  }

  compare() {
    this.currentMode = SCREEN_MODE.COMPARE;
    window.location.href = '/item-comparing/' + this.selectedGroup + '/' + this.selectedItemID1 + '/' + this.selectedItemID2;
  }
}
