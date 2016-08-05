function calcValue(env,idx,data,key,prefix){
  var use_desc = false;
  var descs = [];
  var value = 0;
  //基本値
  var val_base = data[key];
  if(val_base !== undefined){
    value += val_base;
    descs.push(val_base.toFixed(1));
  }
  //コスト依存値
  var val_cost = data[key+'_c'];
  if(val_cost !== undefined){
    value += env.busho[idx].cost * val_cost;
    descs.push('コスト×'+val_cost.toFixed(1));
    use_desc = true;
  }
  //ランク依存値
  var val_rank = data[key+'_r'];
  if(val_rank !== undefined){
    value += env.busho[idx].rank * val_rank;
    descs.push('ランク×'+val_rank.toFixed(1));
    use_desc = true;
  }
  return {
    value: value,
    label: prefix + ": " + value.toFixed(1)+"％" + (use_desc ? ('（内訳: ' + descs.join('＋') + '％）') : ''),
  };
}
var skill_type = {
  separator:" <span style='color:#76601d;'>|</span> ",
  //特に条件などの設定がない普通のスキル
  'none':function(env,idx,data){
    var per = calcValue(env,idx,data,'per','確率');
    var atk = calcValue(env,idx,data,'atk','攻');
    var def = calcValue(env,idx,data,'def','防');
    var des = calcValue(env,idx,data,'des','破壊');
    var spd = calcValue(env,idx,data,'spd','速度');
    var descs = [];
    if(per.value != 0){ descs.push(per.label); }
    if(atk.value != 0){ descs.push(atk.label); }
    if(def.value != 0){ descs.push(def.label); }
    if(des.value != 0){ descs.push(des.label); }
    if(spd.value != 0){ descs.push(spd.label); }
    if(data.desc !== undefined) descs.push(data.desc);
    return {
      target:   data.k,
      yari:     IsMatch(data.k,"槍"), //槍
      yumi:     IsMatch(data.k,"弓"), //弓
      kiba:     IsMatch(data.k,"馬"), //馬
      teppo:    IsMatch(data.k,"砲"), //砲
      heiki:    IsMatch(data.k,"器"), //器
      busho:    IsMatch(data.k,"将"), //将
      eff_per:  per.value, //発動率(0-1f)
      eff_atk:  atk.value, //攻撃効果(0-1f)
      eff_def:  def.value, //防御効果(0-1f)
      eff_des:  des.value, //破壊効果(0-1f)
      eff_spd:  spd.value, //速度効果(0-1f)
      desc:     descs.join(this.separator), //備考
    };
  },
  //"轟槍振鉾"専用
  'goso':function(env,idx,data){
    var per = (data.per!==undefined) ? data.per : 0;
    var atk = (data.atk!==undefined) ? data.atk : 0;
    var def = (data.def!==undefined) ? data.def : 0;
    var des = (data.des!==undefined) ? data.des : 0;
    var spd = (data.spd!==undefined) ? data.spd : 0;
    if(env.busho_def_num >= 20) per = 100;
    var descs = [];
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％");
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％");
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％");
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    if(data.desc !== undefined) descs.push(data.desc);
    descs.push("相手軍の武将数が20以上だと必ずスキル発動");
    
    return {
      target:   data.k,
      yari:     IsMatch(data.k,"槍"), //槍
      yumi:     IsMatch(data.k,"弓"), //弓
      kiba:     IsMatch(data.k,"馬"), //馬
      teppo:    IsMatch(data.k,"砲"), //砲
      heiki:    IsMatch(data.k,"器"), //器
      busho:    IsMatch(data.k,"将"), //将
      eff_per:  per, //発動率(0-1f)
      eff_atk:  atk, //攻撃効果(0-1f)
      eff_def:  def, //防御効果(0-1f)
      eff_des:  des, //破壊効果(0-1f)
      eff_spd:  spd, //速度効果(0-1f)
      desc:     descs.join(this.separator), //備考
    };
  },
  //発動率＝確率×防御武将数
  'mamushi':function(env,idx,data){
    var per = data.per_r * env.busho_def_num;
    var atk = (data.atk!==undefined) ? data.atk : 0;
    var def = (data.def!==undefined) ? data.def : 0;
    var des = (data.des!==undefined) ? data.des : 0;
    var spd = (data.spd!==undefined) ? data.spd : 0;
    var descs = [];
    if(per>100)per=100;//確率には上限がある
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％（内訳: "+data.per_r.toFixed(1) + "％ ×防御武将"+env.busho_def_num+"人）");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％");
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％");
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％");
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    descs.push("発動率＝確率×防御武将数");
    
    return {
      target:   data.k,
      yari:     IsMatch(data.k,"槍"), //槍
      yumi:     IsMatch(data.k,"弓"), //弓
      kiba:     IsMatch(data.k,"馬"), //馬
      teppo:    IsMatch(data.k,"砲"), //砲
      heiki:    IsMatch(data.k,"器"), //器
      busho:    IsMatch(data.k,"将"), //将
      eff_per:  per, //発動率(0-1f)
      eff_atk:  atk, //攻撃効果(0-1f)
      eff_def:  def, //防御効果(0-1f)
      eff_des:  des, //破壊効果(0-1f)
      eff_spd:  spd, //速度効果(0-1f)
      desc:     descs.join(this.separator), //備考
    };
  },
  //合流○○時は効果△倍
  'goryu_eff':function(env,idx,data){
    var atk_r = (env.busho_atk_num > 4 && data.atk_r!==undefined) ? data.atk_r : 1;
    var def_r = (env.busho_atk_num > 4 && data.def_r!==undefined) ? data.def_r : 1;
    var des_r = (env.busho_atk_num > 4 && data.des_r!==undefined) ? data.des_r : 1;
    var per = ((data.per_b!==undefined) ? data.per_b : 0);
    var atk = ((data.atk_b!==undefined) ? data.atk_b : 0) * atk_r;
    var def = ((data.def_b!==undefined) ? data.def_b : 0) * def_r;
    var des = ((data.des_b!==undefined) ? data.des_b : 0) * des_r;
    var spd = ((data.spd_b!==undefined) ? data.spd_b : 0);
    var descs = [];
    if(per>100)per=100;//確率は上限がある
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％");
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％");
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％");
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    if(atk_r != 1) descs.push("合流攻撃時は効果"+atk_r+"倍");
    if(def_r != 1) descs.push("合流攻撃防御時は効果"+def_r+"倍");
    if(des_r != 1) descs.push("合流攻撃時は破壊"+des_r+"倍");
    
    return {
      target:   data.k,
      yari:     IsMatch(data.k,"槍"), //槍
      yumi:     IsMatch(data.k,"弓"), //弓
      kiba:     IsMatch(data.k,"馬"), //馬
      teppo:    IsMatch(data.k,"砲"), //砲
      heiki:    IsMatch(data.k,"器"), //器
      busho:    IsMatch(data.k,"将"), //将
      eff_per:  per, //発動率(0-1f)
      eff_atk:  atk, //攻撃効果(0-1f)
      eff_def:  def, //防御効果(0-1f)
      eff_des:  des, //破壊効果(0-1f)
      eff_spd:  spd, //速度効果(0-1f)
      desc:     descs.join(this.separator), //備考
    };
  },
  //"悠久豊国""専用
  'yukyu':function(env,idx,data){
    var atk_r = (env.busho_atk_num <= 16 && data.atk_r!==undefined) ? data.atk_r : 1;
    var def_r = (env.busho_atk_num <= 16 && data.def_r!==undefined) ? data.def_r : 1;
    var des_r = (env.busho_atk_num <= 16 && data.des_r!==undefined) ? data.des_r : 1;
    var per = ((data.per_b!==undefined) ? data.per_b : 0);
    var atk = ((data.atk_b!==undefined) ? data.atk_b : 0) * atk_r;
    var def = ((data.def_b!==undefined) ? data.def_b : 0) * def_r;
    var des = ((data.des_b!==undefined) ? data.des_b : 0) * des_r;
    var spd = ((data.spd_b!==undefined) ? data.spd_b : 0);
    var descs = [];
    if(per>100)per=100;//確率は上限がある
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％");
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％");
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％");
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    if(atk_r != 1) descs.push("4部隊以下の攻撃で効果"+atk_r+"倍");
    
    return {
      target:   data.k,
      yari:     IsMatch(data.k,"槍"), //槍
      yumi:     IsMatch(data.k,"弓"), //弓
      kiba:     IsMatch(data.k,"馬"), //馬
      teppo:    IsMatch(data.k,"砲"), //砲
      heiki:    IsMatch(data.k,"器"), //器
      busho:    IsMatch(data.k,"将"), //将
      eff_per:  per, //発動率(0-1f)
      eff_atk:  atk, //攻撃効果(0-1f)
      eff_def:  def, //防御効果(0-1f)
      eff_des:  des, //破壊効果(0-1f)
      eff_spd:  spd, //速度効果(0-1f)
      desc:     descs.join(this.separator), //備考
    };
  },
  //夜のみ○○倍
  'night_eff':function(env,idx,data){
    var per = ((data.per_b!==undefined) ? data.per_b : 0);
    var atk = ((data.atk_b!==undefined) ? data.atk_b : 0);
    var def = ((data.def_b!==undefined) ? data.def_b : 0);
    var des = ((data.des_b!==undefined) ? data.des_b : 0);
    var spd = ((data.spd!==undefined) ? data.spd : 0);

    var tail_descs = [];
    if(env.time_zone == 'night'){
      if(data.per_r !== undefined){
        tail_descs.push("20時～翌02時は確率"+data.per_r+"倍");
        per *= data.per_r;
      }
      if(data.atk_r !== undefined){
        tail_descs.push("20時～翌02時は効果"+data.atk_r+"倍");
        atk *= data.atk_r;
      }
      if(data.def_r !== undefined){
        tail_descs.push("20時～翌02時は効果"+data.def_r+"倍");
        def *= data.def_r;
      }
      if(data.des_r !== undefined){
        tail_descs.push("20時～翌02時は破壊"+data.des_r+"倍");
        des += (data.des_r * env.busho[idx].cost)
      }
    }

    var descs = [];
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％");
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％");
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％");
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    if(tail_descs.length > 0) descs.push(tail_descs);
    
    return {
      target:   data.k,
      yari:     IsMatch(data.k,"槍"), //槍
      yumi:     IsMatch(data.k,"弓"), //弓
      kiba:     IsMatch(data.k,"馬"), //馬
      teppo:    IsMatch(data.k,"砲"), //砲
      heiki:    IsMatch(data.k,"器"), //器
      busho:    IsMatch(data.k,"将"), //将
      eff_per:  per, //発動率(0-1f)
      eff_atk:  atk, //攻撃効果(0-1f)
      eff_def:  def, //防御効果(0-1f)
      eff_des:  des, //破壊効果(0-1f)
      eff_spd:  spd, //速度効果(0-1f)
      desc:     descs.join(this.separator), //備考
    };
  },
};

var table_skill = {
  
  //--------------------------------
  //  槍攻
  //--------------------------------
  "槍隊進撃":   { k:"槍", per:10, atk:15, a:"槍隊進撃", b:"槍隊備え", c:"騎馬隊進撃", s1:"槍隊襲撃", s2:"槍隊突撃" },
  "槍隊襲撃":   { k:"槍", per:20, atk:10, a:"槍隊襲撃", b:"槍隊進撃", c:"騎馬隊襲撃", s1:"槍隊堅守", s2:"兵器突撃" },
  "槍隊急襲":   { k:"槍", per:16, atk_c:5 },
  "槍隊奇襲":   { k:"槍", per:30, atk:12 },
  "鬼作左":     { k:"槍", per:30, atk:12, des:20 },
  "槍撃の真髄": { k:"槍", per:20, atk:15 },
  "槍隊乱撃":   { k:"槍", per:30, atk:15, des:15 },
  "義将薙刀":   { k:"槍", per:30, atk:15, des:15 },
  "攻御由緒家": { k:"槍", per:25.5, atk:19.5 },
  "金爆 槍撃":  { k:"槍", per:16, atk_c:5 },
  "槍隊挟撃":   { k:"槍", per:25, atk_c:6.5 },
  "槍隊突撃":   { k:"槍", per:15, atk:20 },
  "槍隊剛撃":   { k:"槍", per:35, atk:20 },
  "相克の叛将": { k:"槍", per:25, atk:25 },
  "槍撃 修羅":  { k:"槍", per:25, atk:25, des:5},
  "鬼小島":     { k:"槍", per:20, atk:30 },
  "天槍の神技": { k:"槍", per:25, atk:30 },
  "姫鬼無双":   { k:"槍", per:25, atk:30, des:30 },
  "陰流":       { k:"槍", per:27, atk:37 },
  "神槍撃":     { k:"槍", per:20, atk:33, atk_r:2 },
  "太白源氏車": { k:"槍", per:24, atk:46 },
  "槍大膳":     { k:"槍", per:15, atk:60 },
  "轟槍振鉾":   { t:"goso", k:"槍", per:5, atk:65 },
  
  //--------------------------------
  //  槍防
  //--------------------------------
  "槍隊堅守":   { k:"槍", per:20, def:10 },
  "槍隊堅陣":   { k:"槍", per:30, def:12 },
  "槍隊備え":   { k:"槍", per:10, def:15 },
  "槍隊守備":   { k:"槍", per:16, def_c:5 },
  "槍隊布陣":   { k:"槍", per:15, def:20 },
  "豪放磊落":   { k:"槍", per:40, def:20 },
  "槍隊円陣":   { k:"槍", per:40, def:20 },
  "火牛の計":   { k:"槍", per:37, def:23 },
  "忠節の槍":   { k:"槍", per:12, def:26 },
  "槍隊守護":   { k:"槍", per:25, def_c:6.5 },
  "槍陣の極み": { k:"槍", per:30, def:30 },
  "甲駿の誓い": { k:"槍", per:40, def:35 },
//  "頑固一徹":   { k:"槍", per:30, def:12 },

  //--------------------------------
  //  弓攻
  //--------------------------------
  "弓隊進撃":     { k:"弓", per:10, atk:15 },
  "弓隊襲撃":     { k:"弓", per:20, atk:10 },
  "弓隊急襲":     { k:"弓", per:16, atk_c:5 },
  "弓隊奇襲":     { k:"弓", per:30, atk:12 },
  "弓撃の真髄":   { k:"弓", per:20, atk:15 },
  "弓隊乱撃":     { k:"弓", per:30, atk:15, des:15 },
  "金爆 弓撃":    { k:"弓", per:16, atk_c:5 },
  "弓隊挟撃":     { k:"弓", per:25, atk_c:6.5 },
  "弓隊突撃":     { k:"弓", per:15, atk:20 },
  "弓隊剛撃":     { k:"弓", per:35, atk:20 },
  "弓撃 夜叉":    { k:"弓", per:25, atk:25, des:5},
  "御曹司の意地": { k:"弓", per:20, atk:24 },
  "三矢の神技":   { k:"弓", per:25, atk:30 },
  "蝮の愛妾":     { k:"弓", per:20, atk:38 },
  "鬼夜叉":       { k:"弓", per:24, atk:35, atk_r:2 },
  "反逆の奏":     { k:"弓", per:25, atk:50 },

  //--------------------------------
  //  弓防
  //--------------------------------
  "弓隊堅守":   { k:"弓", per:20, def:10 },
  "弓隊堅陣":   { k:"弓", per:30, def:12 },
  "弓隊備え":   { k:"弓", per:10, def:15 },
  "弓隊守備":   { k:"弓", per:16, def_c:5 },
  "弓隊布陣":   { k:"弓", per:15, def:20 },
  "忍耐の遠矢": { k:"弓", per:20, def:33 },
  "弓隊円陣":   { k:"弓", per:40, def:20 },
  "弓隊守護":   { k:"弓", per:25, def_c:6.5 },
  "弓陣の極み": { k:"弓", per:30, def:30 },
  "三矢の礎":   { k:"弓", per:40, def:35 },

  //--------------------------------
  //  馬攻
  //--------------------------------
  "騎馬隊進撃": { k:"馬", per:10, atk:15 },
  "騎馬隊襲撃": { k:"馬", per:20, atk:10 },
  "騎馬隊急襲": { k:"馬", per:16, atk_c:5 },
  "騎馬隊奇襲": { k:"馬", per:30, atk:12 },
  "騎突の真髄": { k:"馬", per:20, atk:15 },
  "騎馬隊乱撃": { k:"馬", per:30, atk:15, des:15 },
  "金爆 騎突":  { k:"馬", per:16, atk_c:5 },
  "騎馬隊挟撃": { k:"馬", per:25, atk_c:6.5 },
  "騎馬隊突撃": { k:"馬", per:15, atk:20 },
  "騎馬隊剛撃": { k:"馬", per:35, atk:20 },
  "騎突 金剛":  { k:"馬", per:25, atk:25, des:5 },
  "騎神烈破":   { k:"馬", per:20, atk:35, des:10 },
  "赤備 鬼神":  { k:"馬", per:32, atk:35 },
  "破軍建返し": { k:"馬", per:30, atk:40 },
  "瓶割り柴田": { k:"馬", per:35, atk:40 },

  //--------------------------------
  //  馬防
  //--------------------------------
  "騎馬隊堅守":   { k:"馬", per:20, def:10 },
  "騎馬隊堅陣":   { k:"馬", per:30, def:12 },
  "騎馬隊備え":   { k:"馬", per:10, def:15 },
  "騎馬隊守備":   { k:"馬", per:16, def_c:5 },
  "騎馬隊布陣":   { k:"馬", per:15, def:20 },
  "騎馬隊円陣":   { k:"馬", per:40, def:20 },
  "騎馬隊守護":   { k:"馬", per:25, def_c:6.5 },
  "馬陣の極み":   { k:"馬", per:30, def:30 },
  "貴婦人の返礼": { k:"馬", per:17, def:54 },
  
  //--------------------------------
  //  砲攻
  //--------------------------------
  "鉄砲隊進撃":  { k:"砲", per:8, atk:15 },
  "鉄砲隊奇襲":  { k:"砲", per:25, atk:12 },
  "砲撃の真髄":  { k:"砲", per:20, atk:15 },
  "鉄砲隊挟撃":  { k:"砲", per:20, atk_c:6.5 },
  "鉄砲隊乱撃":  { k:"砲", per:30, atk:15, des:15 },
  "鉄砲隊突撃":  { k:"砲", per:12, atk:20 },
  "鉄砲隊剛撃":  { k:"砲", per:30, atk:20 },
  "鉄砲術 蛍":   { k:"砲", per:25, atk:12 },
  "鉄砲術 小雀": { k:"砲", per:12, atk:20 },
  "六字の采配":  { k:"砲", per:30, atk:25, desc:"攻撃時のみ攻撃側の兵士被害：10%減少"},
  "鬼石曼子":    { k:"砲", per:40, atk:25 },
  "覇王の眷族":  { k:"砲", per:15, atk:30 },
  "稲富流砲術":  { k:"砲", per:15, atk:30 },
  "釣り野伏 鬼": { k:"砲", per:20, atk:30 },
  "薩摩の軍神":  { k:"砲", per:28, atk:30 },
  "祈りの歌":    { k:"砲", per:25, atk:25 },
  "天導 八咫烏": { k:"砲", per:35, atk:40 },
  "天魔波旬":    { k:"砲", per:20, atk:60 },
  "三段撃 神速": { k:"砲", per:50, atk:12, des:15 },
  "鉄甲水軍":    { k:"砲", per:26, atk:25, des:7 },
  "砲撃 羅刹":   { k:"砲", per:25, atk:25, des:5 },
  "繰抜十字紋":  { k:"砲", per:40, atk:30, des:15 },
  "三段撃 激烈": { k:"砲", per:45, atk:30, des:10 },
  "魔王三段撃":  { k:"砲", per:35, atk:30, des:20 },

  //--------------------------------
  //  砲防
  //--------------------------------
  "鉄砲隊堅陣":   { k:"砲", per:30, def:12 },
  "鉄砲隊備え":   { k:"砲", per:10, def:15 },
  "鉄砲隊布陣":   { k:"砲", per:15, def:20 },
  "鉄砲隊円陣":   { k:"砲", per:40, def:20 },
  "鳥瞰銃座陣":   { k:"砲", per:35, def:25 },
  "鉄砲隊守護":   { k:"砲", per:25, def_c:6.5 },
  "黒骨扇月丸":   { k:"砲", per:20, def:30 },
  "智の八犬士":   { k:"砲", per:25, def:30 },
  "砲陣の極み":   { k:"砲", per:30, def:30 },
  "愛山護法":     { k:"砲", per:60, def:30 },
  "根来闇鉄砲":   { k:"砲", per:33, def:33 },
  "釣り野伏 真":  { k:"砲", per:35, def:35 },
  "轟閻 霹靂火":  { k:"砲", per:40, def:36 },
  "返り忠":       { t:"goryu_eff", k:"砲", per_b:25, def_b:25, def_r:2 },

  //--------------------------------
  //  器攻
  //--------------------------------
  "防壁砕き":  { k:"器", per:30, des:12 },
  "兵器進撃":  { k:"器", per:10, atk:15 },
  "城破り":    { k:"器", per:10, des:15 },
  "防壁破り":  { k:"器", per:16, des_c:5 },
  "金爆 砲撃": { k:"器", per:16, des_c:5 },
  "兵器突撃":  { k:"器", per:15, atk:20 },
  "城砕き":    { k:"器", per:15, des:20 },
  "亀甲車":    { k:"器", per:30, des:20 },
  "城崩し":    { k:"器", per:35, des:20 },
  "郭破城":    { k:"器", per:36, des:20 },
  "城崩 奈落": { k:"器", per:25, atk:5, des:25 },
  "轟音 無鹿": { k:"器", per:30, atk:30, des:25 },
  "国貫き":    { k:"器", per:25, des_c:6.5 },
  "国潰し":    { k:"器", per:12, des:35 },

  //--------------------------------
  //  器防
  //--------------------------------
  "兵器布陣":   { k:"器", per:15, def:20 },
  "龍哭の酒":   { k:"器", per:25, def:30 },

  //--------------------------------
  //  槍弓攻
  //--------------------------------
  "若江魂":     { k:"槍弓", per:30, atk:12 },
  "忍道 白虎":  { k:"槍弓", per:60, atk:16 },
  "三矢の教え": { k:"槍弓", per:20, atk:20 },
  "槍弓連撃":   { k:"槍弓", per:30, atk:20 },
  "槍弓鱗撃":   { k:"槍弓", per:35, atk:20 },
  "大三島憐撃": { k:"槍弓", per:35, atk:20 },
  "夕静":       { k:"槍弓", per:35, atk:20, des:10 },
  "獅子奮迅":   { k:"槍弓", per:15, atk:25, des:5 },
  "七槍の剛":   { k:"槍弓", per:30, atk:25 },
  "槍弓猛襲":   { k:"槍弓", per:15, atk_c:9 },
  "絢鳥":       { k:"槍弓", per:35, atk:42, des:15 },
  "魔王ノ片鱗": { k:"槍弓", per:26, atk:40, atk_r:2 },
  "殺生関白":   { k:"槍弓", per:15, atk_c:12, des:5 },
  "猩猩ノ熊王": { k:"槍弓", per:26, atk:55, des:20 },

  //--------------------------------
  //  槍弓防
  //--------------------------------
  "鐘切り":     { k:"槍弓", per:20, def:20 },
  "鉄甲陣":     { k:"槍弓", per:30, def:20 },
  "浅草浪人隊": { k:"槍弓", per:20, def:25 },
  "血路の殿":   { k:"槍弓", per:60, def:25 },
  "七槍の極":   { k:"槍弓", per:30, def:30 },
  "賢女烈婦":   { k:"槍弓", per:30, def:33 },
//  "援槍励檄":   { k:"槍弓", per:30, def:35 },
  "円陣 楔":    { k:"槍弓", per:30, def:36 },
  "元の木阿弥": { k:"槍弓", per:20, def:39 },
  "死兵六道契": { k:"槍弓", per:25, def:39 },
  "上州の黄斑": { k:"槍弓", per:25, def:40 },
  "房州の意地": { k:"槍弓", per:20, def:50 },

  //--------------------------------
  //  槍馬攻
  //--------------------------------
  "荒切武者":     { k:"槍馬", per:15, atk:15, des:4 },
  "代官頭大蔵":   { k:"槍馬", per:20, atk:15 },
  "槍半蔵":       { k:"槍馬", per:17, atk:17 },
  "乗り崩し":     { k:"槍馬", per:20, atk:20, des:5 },
  "老将花菱":     { k:"槍馬", per:30, atk:20 },
  "槍馬連撃":     { k:"槍馬", per:30, atk:20 },
  "官牧の馬姫":   { k:"槍馬", per:35, atk:20 },
  "槍馬鱗撃":     { k:"槍馬", per:35, atk:20 },
  "地黄八幡":     { k:"槍馬", per:35, atk:20 },
  "伏龍応斬":     { k:"槍馬", per:30, atk:20.5 },
  "六蓮鬼突き":   { k:"槍馬", per:30, atk:20.5 },
  "赤備 烈火":    { k:"槍馬", per:25, atk:25, des:5 },
  "孝の八犬士":   { k:"槍馬", per:30, atk:25 },
  "棒道麟撃":     { k:"槍馬", per:30, atk:25, des:5 },
  "御旗盾無":     { k:"槍馬", per:28, atk:26 },
  "単騎駆之将":   { k:"槍馬", per:24, atk:30 },
  "豪勇無比":     { k:"槍馬", per:25, atk:30, des:10 },
  "鷹視狼歩":     { k:"槍馬", per:26, atk:30, des:10 },
  "雷切":         { k:"槍馬", per:30, atk:30 },
  "鍾馗激攻":     { k:"槍馬", per:26, atk:32, des:10.5 },
  "滅 九頭龍":    { k:"槍馬", per:19, atk:33 },
  "応竜恋慕":     { k:"槍馬", per:20, atk:35 },
  "旋風華憐":     { k:"槍馬", per:30, atk:35 },
  "赤備猛虎":     { k:"槍馬", per:30, atk:35 },
  "鬼刺":         { k:"槍馬", per:15, atk_c:9 },
  "穀蔵院飄戸斎": { k:"槍馬", per:20, atk:36 },
  "攻陣 阿形":    { k:"槍馬", per:30, atk:36, desc:"※鍋島直茂(2139)と特殊合成可能"},
  "悌の八犬士":   { k:"槍馬", per:20, atk:40 },
  "武勇百人ノ将": { k:"槍馬", per:22, atk:40 },
  "六道陽炎":     { k:"槍馬", per:15, atk:45 },
  "花礫":         { k:"槍馬", per:26, atk:46 },
  "蒼龍将":       { k:"槍馬", per:10, atk:50 },
  "天鬼怒髪":     { k:"槍馬", per:30, atk:55 },
  "嬬黒突貫":     { k:"槍馬", per:6, atk:60 },
  "天虎招雷":     { k:"槍馬", per:8, atk:80 },

  //--------------------------------
  //  槍馬防
  //--------------------------------
//  "老練ノ伏兵":   { k:"槍馬", per:24, def:26 },
  "千樹挟撃陣":   { k:"槍馬", per:35, def:28 },
  "七槍の匠":     { k:"槍馬", per:30, def:30 },
  "甲州法度":     { k:"槍馬", per:30, def:32 },
  "蛍火":         { k:"槍馬", per:30, def:37 },
  "戦姫 瑞玉":    { k:"槍馬", per:30, def:39 },
  "楔外交":       { k:"槍馬", per:33, def_c:12 },
  "慟哭の義将":   { k:"槍馬", per:34, def:34 },
  "信濃の獅子":   { k:"槍馬", per:20, def:50 },
//  "天つ凪ノ方喰": { k:"槍馬", per:24, def:65 },

  //--------------------------------
  //  槍砲攻
  //--------------------------------
  "橙武者":      { k:"槍砲", per:12.5, atk:10 },
  "槍陣 弧月":   { k:"槍砲", per:35, atk:20, des:10 },
  "月光麒麟":    { k:"槍砲", per:25, atk:25, des:5 },
  "七槍の武":    { k:"槍砲", per:30, atk:25 },
  "夢幻の慈愛":  { k:"槍砲", per:18, atk:30, atk_r:2 },
  "大願幽夢":    { k:"槍砲", per:25, atk:28 },
  "姫鬼戦舞":    { k:"槍砲", per:30, atk:30, des:25 },
  "范可咬撃":    { k:"槍砲", per:30, atk:35 },
  "三段撃 烈火": { k:"槍砲", per:15, atk_c:9 },
  "武運長久":    { k:"槍砲", per:15, atk_c:9, des:5 },
  "浪切":        { k:"槍砲", per:30, atk:37 },
  "銃槍竜騎兵":  { k:"槍砲", per:30, atk:40 },
  "美濃の蝮":    { t:"mamushi", k:"槍砲", per_r:2, atk:42 },
  "煉獄天焦":    { t:"goryu_eff", k:"槍砲", per_b:25, atk_b:25, atk_r:2},

  //--------------------------------
  //  槍砲防
  //--------------------------------
  "船穿応射":   { k:"槍砲", per:20, def:10 },
  "清鏡宗心":   { k:"槍砲", per:20, def:20 },
  "槍砲方陣":   { k:"槍砲", per:40, def:20 },
  "三つ鱗巴陣": { k:"槍砲", per:35, def:25 },
  "月読の偃武": { k:"槍砲", per:55, def:26 },
  "鬼笛乃可勢": { k:"槍砲", per:20, def:30 },
  "七槍の義":   { k:"槍砲", per:30, def:30 },
  "忠魂座禅陣": { k:"槍砲", per:35, def:30 },
  "日輪の礎":   { k:"槍砲", per:20, def:35 },
  "独眼竜轟雷": { k:"槍砲", per:35, def:40 },
  "不屈の再興": { k:"槍砲", per:15, def:44 },
  "大金星":     { k:"槍砲", per:1, def:60 },
  "戦陣巴龍":   { k:"槍砲", per:35, def:25, def_r:4 },

  //--------------------------------
  //  槍器攻
  //--------------------------------
  "七槍の智": { k:"槍器", per:35, des:25 },
  "天下剛断": { k:"槍器", per:20, atk:5, des:20 },
  "神算鬼謀": { k:"槍器", per:10, des:30 },
  "足軽軍法": { k:"槍器", per:15, atk_c:9 },

  //--------------------------------
  //  弓馬攻
  //--------------------------------
  "慙愧の酒":   { k:"弓馬", per:20, atk:15 },
  "中入り":     { k:"弓馬", per:100, atk:18, desc:"防御側の敵襲察知を遅らせる" },
  "啄木鳥":     { k:"弓馬", per:20, atk:20, des:5 },
  "虎舞燦爛":   { k:"弓馬", per:20, atk:20, des:5 },
  "黄竜麒麟児": { k:"弓馬", per:32, atk:20 },
  "天真蘭丸":   { k:"弓馬", per:26, atk:30, des:10 },
  "都忘れ":     { k:"弓馬", per:15, atk_c:9 },
  "反骨の尖兵": { k:"弓馬", per:32, atk:37 },
  "鳳凰馬藺":   { k:"弓馬", per:24, atk:47 },
  "海神ノ破糾": { k:"弓馬", per:35, atk:60 },
  
  //--------------------------------
  //  弓砲攻
  //--------------------------------
  "四風賢鳳":   { k:"弓砲", per:20, atk:10 },
  "上忍遁甲":   { k:"弓砲", per:30, atk:15, des:15 },
  "三段撃ち":   { k:"弓砲", per:20, atk:20, des:5 },
  "弓砲連撃":   { k:"弓砲", per:30, atk:20 },
  "弓砲鱗撃":   { k:"弓砲", per:35, atk:20 },
  "弓撃慈雨":   { k:"弓砲", per:28, atk:22 },
  "鉄砲術明光": { k:"弓砲", per:32, atk:23, des:5 },
  "君子中庸":   { k:"弓砲", per:32, atk:25 },
  "百万一心":   { k:"弓砲", per:35, atk:25 },
  "餓狼関白":   { k:"弓砲", per:35, atk:25 },
  "覇道弓赤鳥": { k:"弓砲", per:42, atk:32 },
  "夜叉の円舞": { k:"弓砲", per:30, atk:33 },
  "傾天の嘆き": { k:"弓砲", per:30, atk:35 },
  "悠久豊国":   { t:"yukyu", k:"弓砲", per_b:35, atk_b:40, atk_r:1.5 },

  //--------------------------------
  //  弓器攻
  //--------------------------------
  "火竜の術": { k:"弓器", per:20, atk:15, des:15 },
  "夢想宴舞": { k:"弓器", per:20, atk:15, des:15 },
  "謀神":     { k:"弓器", per:50, atk:20, dse:30 },
  /*
  {"天廟斬算", "敵武将20", "弓器", 35, 34, 0, 0, 0, "(1.7×防御参加武将数)%上昇"},
  {"天廟斬算", "敵武将100", "弓器", 35, 170, 0, 0, 0, "(1.7×防御参加武将数)%上昇"},
  {"天廟斬算", "敵武将180", "弓器", 35, 306, 0, 0, 0, "(1.7×防御参加武将数)%上昇"},
  */

  //--------------------------------
  //  馬砲攻
  //--------------------------------
  "馬上砲術":    { k:"馬砲", per:60, atk:15 },
  "馬砲連撃":    { k:"馬砲", per:30, atk:20 },
  "三鱗竜騎兵":  { k:"馬砲", per:30, atk:20 },
  "虎砲英主":    { k:"馬砲", per:30, atk:20 },
  "洗礼の旗印":  { k:"馬砲", per:35, atk:25 },
  "玄狐跳澗":    { k:"馬砲", per:30, atk:30 },
  "焔 六冥銭":   { k:"馬砲", per:30, atk:30 },
  "旋風轟撃":    { k:"馬砲", per:35, atk:30 },
  "猿夜叉":      { k:"馬砲", per:35, atk:30, des:10 },
  "冥戦焔騎":    { t:"night_eff", k:"馬砲", per_b:12, per_r:3, atk_b:39 },
  "成香 雀刺":   { k:"馬砲", per:10, atk:40 },
  "武神 火車懸": { k:"馬砲", per:17, atk:38 },
  "天戒 五芒星": { k:"馬砲", per:35, atk:40 },
  
  //--------------------------------
  //  馬器攻
  //--------------------------------
  "馬廻御奉行": { k:"馬器", per:12, atk:8.5, des:8 },
  "鬼美濃":     { k:"馬器", per:16, atk:14, des:10 },
  "驍将奇略":   { k:"馬器", per:35, atk:25, des:20 },
  
  //--------------------------------
  //  砲器攻
  //--------------------------------
  "詭謀の宴":   { k:"砲器", per:50, atk:15 },
  "雑賀式絡繰": { k:"砲器", desc:"※情報なし"},
  "甲州流兵学": { k:"砲器", per:40, atk:20 },
  "太虚国崩し": { k:"砲器", per:25, atk:35, des:30 },
  "天襲懸撃":   { k:"砲器", per:27, atk:53, des:36 },

  //--------------------------------
  //  槍弓馬攻
  //--------------------------------
  "傾奇戦国一":  { k:"槍弓馬", per:30, atk:20 },
  "攻め弾正":    { k:"槍弓馬", per:35, atk:20, des:15 },
  "礼の八犬士":  { k:"槍弓馬", per:40, atk:20 },
  "甲虎襲踏":    { k:"槍弓馬", per:30, atk:25 },
  "戦華白虎":    { k:"槍弓馬", per:30, atk:25 },
  "紅蓮赤備":    { k:"槍弓馬", per:30, atk:25 },
  "車懸り 白狐": { k:"槍弓馬", per:20, atk:30 },
  "手負い獅子":  { k:"槍弓馬", per:20, atk:30, des:10 },
  "五山無双":    { k:"槍弓馬", per:20, atk:30, des:10 },
  "越龍滅閃":    { k:"槍弓馬", per:25, atk:30 },
  "滅覇渾身":    { k:"槍弓馬", per:30, atk:30, des:5 },
  "風林火山 戦": { k:"槍弓馬", per:35, atk:30 },
  "神将":        { k:"槍弓馬", per:35, atk:30 },
  "忠勇義烈":    { k:"槍弓馬", per:40, atk:30, des:20 },
  "風林火山":    { k:"槍弓馬", per:45, atk:30, des:15 },
  "無双獅子":    { k:"槍弓馬", per:45, atk:30, des:35 },
  "地黄八幡 真": { k:"槍弓馬", per:30, atk:32 },
  "龍祖昇躍":    { k:"槍弓馬", per:30, atk:35},
  "赤鬼刺":      { k:"槍弓馬", per:15, atk_c:12 },
  "飛将 蜻蛉切": { k:"槍弓馬", per:25, atk_c:12 },
  "無双蜻蛉切":  { k:"槍弓馬", per:40, atk_c:13 },
  "修羅の援兵":  { t:"goryu_eff", k:"槍弓馬", per_b:25, atk_b:25, atk_r:2 },
  "三山統一":    { k:"槍弓馬", per:16, atk:52 },
  "雷斬仁将":    { t:"mamushi", k:"槍弓馬", per_r:3, atk:52 },
  /*
  {"刀八毘沙門天", "1部隊", "槍弓馬", 20, 65, 0, 0, 0, "合流攻撃時は必ずスキル発動"},
  {"刀八毘沙門天", "合流", "槍弓馬", 100, 65, 0, 0, 0, "合流攻撃時は必ずスキル発動"},
  */
  "天征相克":    { k:"槍弓馬", per:50, atk:70 },

  //--------------------------------
  //  槍弓砲攻
  //--------------------------------
  "館神":       { k:"槍弓砲", per:50, atk:18 },
  "三河魂":     { k:"槍弓砲", per:35, atk:25, des:25 },
  "不屈の名士": { k:"槍弓砲", per:30.5, atk:33 },
  "常世虫":     { k:"槍弓砲", per:26, atk:37 },
  
  //--------------------------------
  //  槍弓器攻
  //--------------------------------
  "神算鬼謀 滅": { k:"槍弓器", per:50, atk:10, atk_c:4, des:26 },

  //--------------------------------
  //  槍馬砲攻
  //--------------------------------
  "綾羅錦繍":    { k:"槍馬砲", per:30, atk:17 },
  "風流雷火":    { k:"槍馬砲", per:35, atk:20 },
  "風流嵐舞":    { k:"槍馬砲", per:25, atk:25 },
  "竜眼月影":    { k:"槍馬砲", per:25, atk:25, des:10 },
  "七槍の勇":    { k:"槍馬砲", per:30, atk:25 },
  "貴煌豊国":    { k:"槍馬砲", per:30, atk:25 },
  "剛勇無双":    { k:"槍馬砲", per:30, atk:25 },
  "九曜激昂":    { k:"槍馬砲", per:25, atk:27 },
  "覇道 不如帰": { k:"槍馬砲", per:30, atk:30, des:30 },
  "声遣縦横":    { k:"槍馬砲", per:24, atk:38 },
  "鬼五郎左":    { k:"槍馬砲", per:26, atk:38 },
  "黒鬼刺":      { k:"槍馬砲", per:15, atk_c:10 },
  /*
  {"七難八苦の誓", "敵武将20", "槍馬砲", 25, 30, 0, 0, 0, "(1.5×防御参加武将数)%上昇"},
  {"七難八苦の誓", "敵武将100", "槍馬砲", 25, 150, 0, 0, 0, "(1.5×防御参加武将数)%上昇"},
  {"七難八苦の誓", "敵武将180", "槍馬砲", 25, 270, 0, 0, 0, "(1.5×防御参加武将数)%上昇"},
  */
  //--------------------------------
  //  槍馬器攻
  //--------------------------------
  "双頭蛇 国盗": { k:"槍馬器", per:27, atk:25 },
  "鬼神轟雷":    { k:"槍馬器", per:25, atk:27 },
  
  //--------------------------------
  //  弓馬砲攻
  //--------------------------------
  "軍神強襲":   { k:"弓馬砲", per:20, atk:25 },
  "青海の騎将": { k:"弓馬砲", per:30, atk:30 },
  
  //--------------------------------
  //  弓馬器攻
  //--------------------------------
  "浅井一文字": { k:"弓馬器", per:45, atk:35 },
  
  //--------------------------------
  //  弓砲器攻
  //--------------------------------
  "炮烙の計":   { k:"弓砲器", per:15, atk:20, des:15 },
  "船団爆雷" :  { k:"弓砲器", per:25, atk:30, des:10 },
  "気丈な覚悟": { k:"弓砲器", per:100, atk:50, desc:"戦闘敗北時は自軍兵士被害数＋25%"},

  //--------------------------------
  //  馬砲器攻
  //--------------------------------
  "独眼竜":      { k:"馬砲器", per:30, atk:25, des:5 },
  "戦陣 風雷火": { k:"馬砲器", per:20, atk:44, des:32 },
  "独眼竜咆哮":  { k:"馬砲器", per:30, atk:35, des:20 },
  "破軍星":      { k:"馬砲器", per:40, atk:18, atk_c:8, des:8, des_c:3 },

  //--------------------------------
  //  槍弓馬砲攻
  //--------------------------------
  "虎牙猛撃":    { k:"槍弓馬砲", per:33, atk:20 },
  "進撃 四獣操": { k:"槍弓馬砲", per:30, atk:25 },
  "鳳凰炎舞":    { k:"槍弓馬砲", per:25, atk:26 },
  "日本の副王":  { k:"槍弓馬砲", per:30, atk:26 },
  "義兵進軍":    { k:"槍弓馬砲", per:100, atk:7, spd:10 },

  //--------------------------------
  //  槍馬砲器攻
  //--------------------------------
  "猛虎咆哮": { k:"槍馬砲器", per:45, atk:10, des:40 },
  "般若強襲": { k:"槍馬砲器", per:40, atk:12, des:40 },

  //--------------------------------
  //  上級器攻
  //--------------------------------
  "鬼謀 国砕": { k:"上級器", per:35, atk:10, des:25 },
  "赤誠奮迅":  { k:"上級器", per:33, atk:12, des:23.5 },

  //--------------------------------
  //  秘境兵攻
  //--------------------------------
  "常山女軍": { k:"秘境兵", per:20, atk:30 },

  //--------------------------------
  //  全攻
  //--------------------------------
  "車懸り": { k:"全", per:15, atk:30 },
};