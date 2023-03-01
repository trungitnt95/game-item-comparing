import {Item} from "./app.component";

const skyrimData = [

//GameName#Group#ItemID#ItemName#Value#Armor#Weigh#Class#UpgMaterial#Perl#Slot#Damage#Level#Effect#ImageURL#Type
  'Skyrim#HELMET#ID000#skypeName000#0#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID001#skypeName001#10#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID002#skypeName002#20#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID003#skypeName003#30#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#D004#skypeName004#40#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID005#skypeName005#50#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID006#skypeName006#60#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID007#skypeName007#70#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID008#skypeName008#80#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID009#skypeName009#90#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID000#skypeName000#00#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID001#skypeName001#10#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID002#skypeName002#20#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID003#skypeName003#30#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#D004#skypeName004#40#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID005#skypeName005#50#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID006#skypeName006#60#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID007#skypeName007#70#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID008#skypeName008#80#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID009#skypeName009#90#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
];

export const data = [];
skyrimData.forEach(i => {
  let values = i.split('#');
  const itemObj: Item = {
    id: values[2],
    group: values[1],
    name: values[3],
    value: values[4],
    armor: values[5],
    weight: values[6],
    class: values[7],
    upgMaterial: values[8],
    perl: values[9],
    slot: values[10],
    damage: values[11],
    level: values[12],
    effect: values[13],
    imgUrl: values[14],
    type: values[15]
  };
  // @ts-ignore
  data.push(itemObj);
});
