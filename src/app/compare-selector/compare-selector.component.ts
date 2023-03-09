import {Component, Input} from '@angular/core';
// @ts-ignore
import {Item} from '../item';
import {data} from "../skyrim.data.constant";

export enum SCREEN_MODE {
  LIST,
  COMPARE,
  DETAIL
}
export enum SKYRIM_GROUP {
  HELMET,
  GOO2
}


@Component({
  selector: 'app-compare-selector',
  templateUrl: './compare-selector.component.html',
  styleUrls: ['./compare-selector.component.scss']
})
export class CompareSelectorComponent {
  dataList = data;
  title = 'game-item-comparing';
  SCREEN_MODE = SCREEN_MODE;
  currentMode = SCREEN_MODE.LIST;

  SKYRIM_GROUP = SKYRIM_GROUP;
  selectedGroup: SKYRIM_GROUP;
  // HELMET
  selectedGroupData = [];

  @Input('selectedItemID1')
  selectedItemID1?: string;
  @Input('selectedItemID2')
  selectedItemID2?: string;

  constructor() {
    // console.log(this.selectedItemID1);
    const href = window.location.href;
    if (href.includes('/item-comparing') ) {
      this.currentMode = SCREEN_MODE.COMPARE;
    } else if (href.includes('/item-detail')) {
      this.currentMode = SCREEN_MODE.DETAIL;
    } else {
      this.currentMode = SCREEN_MODE.LIST;
    }
    this.selectedGroup = SKYRIM_GROUP.HELMET;
    if (this.currentMode === SCREEN_MODE.LIST || this.currentMode === SCREEN_MODE.COMPARE) {
      this.prepareItemInGroup(SKYRIM_GROUP.HELMET);
    }
  }

  prepareItemInGroup(group: SKYRIM_GROUP) {
    this.selectedGroupData = data.filter((t: Item) => t.group === SKYRIM_GROUP[group]);
    // console.log(this.selectedGroupData);
  }

  changeMode(selectedMode: SCREEN_MODE) {
    this.currentMode = selectedMode;
  }

  changeGroup(selecedGroup: SKYRIM_GROUP) {
    this.selectedGroup = selecedGroup;
    this.selectedItemID1 = undefined;
    this.selectedItemID2 = undefined;
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
