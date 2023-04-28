import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AngularFirebaseService} from "../../angular-firebase.service";
import {Group} from "../../model/group.enum";

@Component({
  selector: 'app-detail-schedule',
  templateUrl: './detail-schedule.component.html',
  styleUrls: ['./detail-schedule.component.scss']
})
export class DetailScheduleComponent implements OnInit, OnChanges {

  @Input('selectedSchedule')
  selectedScheduled: any;
  isShowAddingFood = false;
  selectedGroup: string|undefined;
  selectedFoodId: string|undefined;
  listFood: any[] = [];
  Group = Group;
  numberOf100Gram = 1;
  selectedFoodInScheduled: any[] = [];

  nutrisFromMaster: number = 0;
  result: any = null;
  nutriAttributeNames: string[] = [];

  units: any = units;

  constructor(private afService: AngularFirebaseService) {
  }

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
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
            this.result = JSON.parse(JSON.stringify(n));
            this.nutriAttributeNames = [];
            delete this.result.name;
            delete this.result.nameEnglish;
            console.log(this.result);
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

  getText(key: any) {
    switch (key) {
      case 'NGU_COC': return 'Ngũ cốc';
      case 'KHOAI_CU': return 'Khoai củ';
      case 'HAT': return 'Hạt';
      case 'RAU_CU': return 'Rau củ';
      case 'QUA': return 'Quả';
      case 'DAU_MO_BO': return 'Dầu, Mỡ, Bơ';
      case 'THIT': return 'Thịt';
      case 'THUY_SAN': return 'Thủy sản';
      case 'TRUNG': return 'Trứng';
      case 'SUA': return 'Sữa';
      case 'NUOC': return 'Nước, đồ uống';
      case 'CHILD': return 'Child';
      case 'ADULT': return 'Adult';
      case 'OLD': return 'Old';
      case 'MAN': return 'Male';
      case 'WOMAN': return 'Female';
      case 'ONE_WEEK': return '7 days';
      case 'WO_WEEKS': return '14 days';
      case 'ONE_MONTH': return '30 days';
      default: return '1 day';
    }
  }

  isNotValidForm() {
    return !this.selectedScheduled || !this.selectedGroup || !this.selectedFoodId || !this.numberOf100Gram;
  }

  onRemoveFoodOut(food: any) {
    this.afService.getQuery(this.afService.loggedInUID + '/schedule_food/' + this.selectedScheduled.key)
      .orderByChild('foodKey').equalTo(food.foodKey).get().then((result) => {
        if (result?.val()) {
          const foodId = Object.keys(result.val())[0];
          console.log(foodId);
          this.afService.delete(this.afService.loggedInUID + '/schedule_food/' + this.selectedScheduled.key,
            foodId);
        }
    });
  }
}
export const units = {
  "acidAspartic": 'mg',
  "acidGlutamic": 'mg',
  "alanin": 'mg',
  "alphaCaroten": 'μg',
  "arachidic": 'g',
  "arachidonic": 'g',
  "arginin": 'mg',
  "ash": 'g',
  "behenic": 'g',
  "betaCaroten": 'μg',
  "betaCryptoXanthin": 'μg',
  "calci": 'mg',
  "celluloza": 'g',
  "cholesterol": 'mg',
  "cystin": 'mg',
  "daidzein": 'mg',
  "docosahexaenoic": 'g',
  "dong": 'μg',
  "eicosapentaenoic": 'g',
  "folat": 'μg',
  "fructoza": 'g',
  "galactoza": 'g',
  "genistein": 'mg',
  "glucid": 'g',
  "glucoza": 'g',
  "glycetin": 'mg',
  "glycin": 'mg',
  "histidin": 'mg',
  "isoleucin": 'mg',
  "kCal": 'KCal',
  "kJ": 'KJ',
  "kali": 'mg',
  "kem": 'mg',
  "lactoza": 'g',
  "leucin": 'mg',
  "lignoceric": 'g',
  "linoleic": 'g',
  "linolenic": 'g',
  "lipit": 'g',
  "luteinZeaxanthin": 'μg',
  "lycopen": 'μg',
  "lysin": 'mg',
  "magie": 'mg',
  "maltoza": 'g',
  "mangan": 'mg',
  "margaric": 'g',
  "methionin": 'mg',
  "myristoleic": 'g',
  "natri": 'mg',
  "oleic": 'g',
  "palmitic": 'g',
  "palmitoleic": 'g',
  "phenylalanin": 'mg',
  "phospho": 'mg',
  "phytosterol": 'mg',
  "prolin": 'mg',
  "protein": 'g',
  "purin": 'mg',
  "sacaroza": 'g',
  "sat": 'mg',
  "selen": 'μg',
  "serin": 'mg',
  "stearic": 'g',
  "sugar": 'g',
  "threonin": 'mg',
  "totalIsoflavon": 'mg',
  "totalMonounsaturatedFattyAcid": 'g',
  "totalPolyunsaturatedFattyAcid": 'g',
  "totalSaturatedFattyAcid": 'g',
  "totalTransFattyAcid": 'g',
  "tryptophan": 'mg',
  "tyrosin": 'mg',
  "valin": 'mg',
  "vitaminA": 'μg',
  "vitaminB1": 'mg',
  "vitaminB12": 'μg',
  "vitaminB2": 'mg',
  "vitaminB5": 'mg',
  "vitaminB6": 'mg',
  "vitaminB9": 'μg',
  "vitaminC": 'mg',
  "vitaminD": 'μg',
  "vitaminE": 'mg',
  "vitaminH": 'μg',
  "vitaminK": 'μg',
  "vitaminPP": 'mg',
  "water": 'g'
};
