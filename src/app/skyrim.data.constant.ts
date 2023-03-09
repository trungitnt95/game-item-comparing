import {Item} from './item';

const skyrimData = [

//GameName#Group#ItemID#ItemName#Value#Armor#Weigh#Class#UpgMaterial#Perl#Slot#Damage#Level#Effect#ImageURL#Type
  'Skyrim#HELMET#ID000#askypeName000#0#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID001#bskypeName001#10#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID002#cskypeName002#20#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID003#dskypeName003#30#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#D004#eskypeName004#40#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID005#fskypeName005#50#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID006#gskypeName006#60#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID007#ghskypeName007#70#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID008#iskypeName008#80#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#HELMET#ID009#jskypeName009#90#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID000#kskypeName000#00#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID001#lskypeName001#10#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID002#mskypeName002#20#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID003#nskypeName003#30#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#D004#oskypeName004#40#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID005#pskypeName005#50#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID006#qskypeName006#60#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID007#rskypeName007#70#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
  'Skyrim#G002#ID008#tskypeName008#80#0#0#Heavy armor, Helmet#Steel Ingot#-#Two hand#10#1000#-#https://static.wikia.nocookie.net/elderscrolls/images/0/0e/Blades_Helmet_%28Skyrim%29.png#Battleaxe',
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
