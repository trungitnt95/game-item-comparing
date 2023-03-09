import { Component } from '@angular/core';
import {Item} from "../item";
import {data} from "../skyrim.data.constant";
import {SKYRIM_GROUP} from "../compare-selector/compare-selector.component";
import {CountService} from "../counter/count.service";

@Component({
  selector: 'app-item-comparing',
  templateUrl: './item-comparing.component.html',
  styleUrls: ['./item-comparing.component.scss']
})
export class ItemComparingComponent {

  selectedItem1 = null;
  selectedItem2 = null;
  selectedItemID1 = undefined;
  selectedItemID2 = undefined;
  constructor(private countService: CountService) {
    const params = window.location.href.split('/');
    // console.log(params);
    // @ts-ignore
    const selectedGroup = SKYRIM_GROUP[params[4]];
    // @ts-ignore
    this.selectedItemID1 = params[5];
    // @ts-ignore
    this.selectedItemID2 = params[6];
    const selectedGroupData = data.filter((t: Item) => t.group === selectedGroup);

    // @ts-ignore
    this.selectedItem2 = selectedGroupData.find((t: Item) => t.id === this.selectedItemID2);
    // @ts-ignore
    this.selectedItem1 = selectedGroupData.find((t: Item) => t.id === this.selectedItemID1);

    this.countService.updateComparePageView();
  }
}
