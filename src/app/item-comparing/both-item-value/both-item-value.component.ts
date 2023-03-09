import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-both-item-value',
  templateUrl: './both-item-value.component.html',
  styleUrls: ['./both-item-value.component.scss']
})
export class BothItemValueComponent {

  @Input('fieldName')
  fieldName: string | undefined;
  @Input('displayText')
  displayText: string | undefined;
  @Input('selectedItem1')
  selectedItem1: any;
  @Input('selectedItem2')
  selectedItem2: any;

}
