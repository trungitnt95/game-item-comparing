import { Component } from '@angular/core';
import {Item, SKYRIM_GROUP} from "../app.component";
import {data} from "../skyrim.data.constant";

@Component({
  selector: 'app-item-comparing',
  templateUrl: './item-comparing.component.html',
  styleUrls: ['./item-comparing.component.scss']
})
export class ItemComparingComponent {

  selectedItem1 = null;
  selectedItem2 = null;
  constructor() {
    const params = window.location.href.split('/');
    console.log(params);
    // @ts-ignore
    const selectedGroup = SKYRIM_GROUP[params[4]];
    // @ts-ignore
    const selectedItemID1 = params[5];
    // @ts-ignore
    const selectedItemID2 = params[6];
    const selectedGroupData = data.filter((t: Item) => t.group === selectedGroup);

    // @ts-ignore
    this.selectedItem2 = selectedGroupData.find((t: Item) => t.id === selectedItemID2);
    // @ts-ignore
    this.selectedItem1 = selectedGroupData.find((t: Item) => t.id === selectedItemID1);
  }
}
