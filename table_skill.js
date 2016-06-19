var skill_type = {
  separator:" <span style='color:#76601d;'>|</span> ",
  
  //特に条件などの設定がない普通のスキル
  'none':function(env,idx,data){
    var per = (data.per!==undefined) ? data.per : 0;
    var atk = (data.atk!==undefined) ? data.atk : 0;
    var def = (data.def!==undefined) ? data.def : 0;
    var des = (data.des!==undefined) ? data.des : 0;
    var spd = (data.spd!==undefined) ? data.spd : 0;
    var descs = [];
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％");
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％");
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％");
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    if(data.desc !== undefined) descs.push(data.desc);
    
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
  //コスト依存スキル
  'cost':function(env,idx,data){
    var per = (data.per!==undefined) ? data.per : 0;
    var atk = ((data.atk_b!==undefined) ? data.atk_b : 0);
    var def = ((data.def_b!==undefined) ? data.def_b : 0);
    var des = ((data.des_b!==undefined) ? data.des_b : 0);
    var spd = ((data.spd!==undefined) ? data.spd : 0);

    var atk_desc = "";
    if(data.atk_r !== undefined){
      atk_desc += "（内訳: ";
      if(atk != 0) atk_desc += atk.toFixed(1) + "＋";
      atk_desc += ("コスト×"+data.atk_r.toFixed(1));
      atk_desc += "％）";
      atk += (data.atk_r * env.busho[idx].cost)
    }
    var def_desc = "";
    if(data.def_r !== undefined){
      def_desc += "（内訳: ";
      if(def != 0) def_desc += def.toFixed(1) + "＋";
      def_desc += ("コスト×"+data.def_r.toFixed(1));
      def_desc += "％）"
      def += (data.def_r * env.busho[idx].cost)
    }
    var des_desc = "";
    if(data.des_r !== undefined){
      des_desc += "（内訳: ";
      if(des != 0) des_desc += des.toFixed(1) + "＋";
      des_desc += ("コスト×"+data.des_r.toFixed(1));
      des_desc += "％）"
      des += (data.des_r * env.busho[idx].cost)
    }

    var descs = [];
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％"+atk_desc);
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％"+def_desc);
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％"+des_desc);
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    
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
  //ランク依存スキル
  'rank':function(env,idx,data){
    var per = (data.per!==undefined) ? data.per : 0;
    var atk = data.atk_b + (data.atk_r * env.busho[idx].rank);
    var def = (data.def!==undefined) ? data.def : 0;
    var des = (data.des!==undefined) ? data.des : 0;
    var spd = (data.spd!==undefined) ? data.spd : 0;
    var descs = [];
    if(per != 0) descs.push("確率: "+per.toFixed(1)+"％");
    if(atk != 0) descs.push("攻: "+atk.toFixed(1)+"％（内訳: "+data.atk_b.toFixed(1) + "＋ランク×"+data.atk_r.toFixed(1)+" ％）");
    if(def != 0) descs.push("防: "+def.toFixed(1)+"％");
    if(des != 0) descs.push("破壊: "+des.toFixed(1)+"％");
    if(spd != 0) descs.push("速度: "+spd.toFixed(1)+"％");
    
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
  //"轟槍振鉾"専用
  'goso':function(env,idx,data){
    var per = (data.per!==undefined) ? data.per : 0;
    var atk = (data.atk!==undefined) ? data.atk : 0;
    var def = (data.def!==undefined) ? data.def : 0;
    var des = (data.des!==undefined) ? data.des : 0;
    var spd = (data.spd!==undefined) ? data.spd : 0;
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
};

var table_skill = {
  
  //--------------------------------
  //  槍攻
  //--------------------------------
  "槍隊進撃":   { t:"none", k:"槍", per:10, atk:15, a:"槍隊進撃", b:"槍隊備え", c:"騎馬隊進撃", s1:"槍隊襲撃", s2:"槍隊突撃" },
  "槍隊襲撃":   { t:"none", k:"槍", per:20, atk:10, a:"槍隊襲撃", b:"槍隊進撃", c:"騎馬隊襲撃", s1:"槍隊堅守", s2:"兵器突撃" },
  "槍隊急襲":   { t:"cost", k:"槍", per:16, atk_r:5 },
  "槍隊奇襲":   { t:"none", k:"槍", per:30, atk:12 },
  "鬼作左":     { t:"none", k:"槍", per:30, atk:12, des:20 },
  "槍撃の真髄": { t:"none", k:"槍", per:20, atk:15 },
  "槍隊乱撃":   { t:"none", k:"槍", per:30, atk:15, des:15 },
  "義将薙刀":   { t:"none", k:"槍", per:30, atk:15, des:15 },
  "攻御由緒家": { t:"none", k:"槍", per:25.5, atk:19.5 },
  "金爆 槍撃":  { t:"cost", k:"槍", per:16, atk_r:5 },
  "槍隊挟撃":   { t:"cost", k:"槍", per:25, atk_r:6.5 },
  "槍隊突撃":   { t:"none", k:"槍", per:15, atk:20 },
  "槍隊剛撃":   { t:"none", k:"槍", per:35, atk:20 },
  "相克の叛将": { t:"none", k:"槍", per:25, atk:25 },
  "槍撃 修羅":  { t:"none", k:"槍", per:25, atk:25, des:5},
  "鬼小島":     { t:"none", k:"槍", per:20, atk:30 },
  "天槍の神技": { t:"none", k:"槍", per:25, atk:30 },
  "姫鬼無双":   { t:"none", k:"槍", per:25, atk:30, des:30 },
  "陰流":       { t:"none", k:"槍", per:27, atk:37 },
  "神槍撃":     { t:"rank", k:"槍", per:20, atk_b:33, atk_r:2 },
  "太白源氏車": { t:"none", k:"槍", per:24, atk:46 },
  "槍大膳":     { t:"none", k:"槍", per:15, atk:60 },
  "轟槍振鉾":   { t:"goso", k:"槍", per:5, atk:65 },
  
  //--------------------------------
  //  弓攻
  //--------------------------------
  "弓隊進撃":     { t:"none", k:"弓", per:10, atk:15 },
  "弓隊襲撃":     { t:"none", k:"弓", per:20, atk:10 },
  "弓隊急襲":     { t:"cost", k:"弓", per:16, atk_r:5 },
  "弓隊奇襲":     { t:"none", k:"弓", per:30, atk:12 },
  "弓撃の真髄":   { t:"none", k:"弓", per:20, atk:15 },
  "弓隊乱撃":     { t:"none", k:"弓", per:30, atk:15, des:15 },
  "金爆 弓撃":    { t:"cost", k:"弓", per:16, atk_r:5 },
  "弓隊挟撃":     { t:"cost", k:"弓", per:25, atk_r:6.5 },
  "弓隊突撃":     { t:"none", k:"弓", per:15, atk:20 },
  "弓隊剛撃":     { t:"none", k:"弓", per:35, atk:20 },
  "弓撃 夜叉":    { t:"none", k:"弓", per:25, atk:25, des:5},
  "御曹司の意地": { t:"none", k:"弓", per:20, atk:24 },
  "三矢の神技":   { t:"none", k:"弓", per:25, atk:30 },
  "蝮の愛妾":     { t:"none", k:"弓", per:20, atk:38 },
  "鬼夜叉":       { t:"rank", k:"弓", per:24, atk_b:35, atk_r:2 },
  "反逆の奏":     { t:"none", k:"弓", per:25, atk:50 },
  
  //--------------------------------
  //  馬攻
  //--------------------------------
  "騎馬隊進撃": { t:"none", k:"馬", per:10, atk:15 },
  "騎馬隊襲撃": { t:"none", k:"馬", per:20, atk:10 },
  "騎馬隊急襲": { t:"cost", k:"馬", per:16, atk_r:5 },
  "騎馬隊奇襲": { t:"none", k:"馬", per:30, atk:12 },
  "騎突の真髄": { t:"none", k:"馬", per:20, atk:15 },
  "騎馬隊乱撃": { t:"none", k:"馬", per:30, atk:15, des:15 },
  "金爆 騎突":  { t:"cost", k:"馬", per:16, atk_r:5 },
  "騎馬隊挟撃": { t:"cost", k:"馬", per:25, atk_r:6.5 },
  "騎馬隊突撃": { t:"none", k:"馬", per:15, atk:20 },
  "騎馬隊剛撃": { t:"none", k:"馬", per:35, atk:20 },
  "騎突 金剛":  { t:"none", k:"馬", per:25, atk:25, des:5 },
  "騎神烈破":   { t:"none", k:"馬", per:20, atk:35, des:10 },
  "赤備 鬼神":  { t:"none", k:"馬", per:32, atk:35 },
  "破軍建返し": { t:"none", k:"馬", per:30, atk:40 },
  "瓶割り柴田": { t:"none", k:"馬", per:35, atk:40 },
  
  //--------------------------------
  //  砲攻
  //--------------------------------
  "鉄砲隊進撃":  { t:"none", k:"砲", per:8, atk:15 },
  "鉄砲隊奇襲":  { t:"none", k:"砲", per:25, atk:12 },
  "砲撃の真髄":  { t:"none", k:"砲", per:20, atk:15 },
  "鉄砲隊挟撃":  { t:"cost", k:"砲", per:20, atk_r:6.5 },
  "鉄砲隊乱撃":  { t:"none", k:"砲", per:30, atk:15, des:15 },
  "鉄砲隊突撃":  { t:"none", k:"砲", per:12, atk:20 },
  "鉄砲隊剛撃":  { t:"none", k:"砲", per:30, atk:20 },
  "鉄砲術 蛍":   { t:"none", k:"砲", per:25, atk:12 },
  "鉄砲術 小雀": { t:"none", k:"砲", per:12, atk:20 },
  "六字の采配":  { t:"none", k:"砲", per:30, atk:25, desc:"攻撃時のみ攻撃側の兵士被害：10%減少"},
  "鬼石曼子":    { t:"none", k:"砲", per:40, atk:25 },
  "覇王の眷族":  { t:"none", k:"砲", per:15, atk:30 },
  "稲富流砲術":  { t:"none", k:"砲", per:15, atk:30 },
  "釣り野伏 鬼": { t:"none", k:"砲", per:20, atk:30 },
  "薩摩の軍神":  { t:"none", k:"砲", per:28, atk:30 },
  "祈りの歌":    { t:"none", k:"砲", per:25, atk:25 },
  "天導 八咫烏": { t:"none", k:"砲", per:35, atk:40 },
  "天魔波旬":    { t:"none", k:"砲", per:20, atk:60 },
  "三段撃 神速": { t:"none", k:"砲", per:50, atk:12, des:15 },
  "鉄甲水軍":    { t:"none", k:"砲", per:26, atk:25, des:7 },
  "砲撃 羅刹":   { t:"none", k:"砲", per:25, atk:25, des:5 },
  "繰抜十字紋":  { t:"none", k:"砲", per:40, atk:30, des:15 },
  "三段撃 激烈": { t:"none", k:"砲", per:45, atk:30, des:10 },
  "魔王三段撃":  { t:"none", k:"砲", per:35, atk:30, des:20 },

  //--------------------------------
  //  器攻
  //--------------------------------
  "防壁砕き":  { t:"none", k:"器", per:30, des:12 },
  "兵器進撃":  { t:"none", k:"器", per:10, atk:15 },
  "城破り":    { t:"none", k:"器", per:10, des:15 },
  "防壁破り":  { t:"cost", k:"器", per:16, des_r:5 },
  "金爆 砲撃": { t:"cost", k:"器", per:16, des_r:5 },
  "兵器突撃":  { t:"none", k:"器", per:15, atk:20 },
  "城砕き":    { t:"none", k:"器", per:15, des:20 },
  "亀甲車":    { t:"none", k:"器", per:30, des:20 },
  "城崩し":    { t:"none", k:"器", per:35, des:20 },
  "郭破城":    { t:"none", k:"器", per:36, des:20 },
  "城崩 奈落": { t:"none", k:"器", per:25, atk:5, des:25 },
  "轟音 無鹿": { t:"none", k:"器", per:30, atk:30, des:25 },
  "国貫き":    { t:"cost", k:"器", per:25, des_r:6.5 },
  "国潰し":    { t:"none", k:"器", per:12, des:35 },

  //--------------------------------
  //  槍弓攻
  //--------------------------------
  "若江魂":     { t:"none", k:"槍弓", per:30, atk:12 },
  "忍道 白虎":  { t:"none", k:"槍弓", per:60, atk:16 },
  "三矢の教え": { t:"none", k:"槍弓", per:20, atk:20 },
  "槍弓連撃":   { t:"none", k:"槍弓", per:30, atk:20 },
  "槍弓鱗撃":   { t:"none", k:"槍弓", per:35, atk:20 },
  "大三島憐撃": { t:"none", k:"槍弓", per:35, atk:20 },
  "夕静":       { t:"none", k:"槍弓", per:35, atk:20, des:10 },
  "獅子奮迅":   { t:"none", k:"槍弓", per:15, atk:25, des:5 },
  "七槍の剛":   { t:"none", k:"槍弓", per:30, atk:25 },
  "槍弓猛襲":   { t:"cost", k:"槍弓", per:15, atk_r:9 },
  "絢鳥":       { t:"none", k:"槍弓", per:35, atk:42, des:15 },
  "魔王ノ片鱗": { t:"rank", k:"槍弓", per:26, atk_b:40, atk_r:2 },
  "殺生関白":   { t:"cost", k:"槍弓", per:15, atk_r:12, des:5 },
  "猩猩ノ熊王": { t:"none", k:"槍弓", per:26, atk:55, des:20 },

  //--------------------------------
  //  槍馬攻
  //--------------------------------
  "荒切武者":     { t:"none", k:"槍馬", per:15, atk:15, des:4 },
  "代官頭大蔵":   { t:"none", k:"槍馬", per:20, atk:15 },
  "槍半蔵":       { t:"none", k:"槍馬", per:17, atk:17 },
  "乗り崩し":     { t:"none", k:"槍馬", per:20, atk:20, des:5 },
  "老将花菱":     { t:"none", k:"槍馬", per:30, atk:20 },
  "槍馬連撃":     { t:"none", k:"槍馬", per:30, atk:20 },
  "官牧の馬姫":   { t:"none", k:"槍馬", per:35, atk:20 },
  "槍馬鱗撃":     { t:"none", k:"槍馬", per:35, atk:20 },
  "地黄八幡":     { t:"none", k:"槍馬", per:35, atk:20 },
  "伏龍応斬":     { t:"none", k:"槍馬", per:30, atk:20.5 },
  "六蓮鬼突き":   { t:"none", k:"槍馬", per:30, atk:20.5 },
  "赤備 烈火":    { t:"none", k:"槍馬", per:25, atk:25, des:5 },
  "孝の八犬士":   { t:"none", k:"槍馬", per:30, atk:25 },
  "棒道麟撃":     { t:"none", k:"槍馬", per:30, atk:25, des:5 },
  "御旗盾無":     { t:"none", k:"槍馬", per:28, atk:26 },
  "単騎駆之将":   { t:"none", k:"槍馬", per:24, atk:30 },
  "豪勇無比":     { t:"none", k:"槍馬", per:25, atk:30, des:10 },
  "鷹視狼歩":     { t:"none", k:"槍馬", per:26, atk:30, des:10 },
  "雷切":         { t:"none", k:"槍馬", per:30, atk:30 },
  "鍾馗激攻":     { t:"none", k:"槍馬", per:26, atk:32, des:10.5 },
  "滅 九頭龍":    { t:"none", k:"槍馬", per:19, atk:33 },
  "応竜恋慕":     { t:"none", k:"槍馬", per:20, atk:35 },
  "旋風華憐":     { t:"none", k:"槍馬", per:30, atk:35 },
  "赤備猛虎":     { t:"none", k:"槍馬", per:30, atk:35 },
  "鬼刺":         { t:"cost", k:"槍馬", per:15, atk_r:9 },
  "穀蔵院飄戸斎": { t:"none", k:"槍馬", per:20, atk:36 },
  "攻陣 阿形":    { t:"none", k:"槍馬", per:30, atk:36, desc:"※鍋島直茂(2139)と特殊合成可能"},
  "悌の八犬士":   { t:"none", k:"槍馬", per:20, atk:40 },
  "武勇百人ノ将": { t:"none", k:"槍馬", per:22, atk:40 },
  "六道陽炎":     { t:"none", k:"槍馬", per:15, atk:45 },
  "花礫":         { t:"none", k:"槍馬", per:26, atk:46 },
  "蒼龍将":       { t:"none", k:"槍馬", per:10, atk:50 },
  "天鬼怒髪":     { t:"none", k:"槍馬", per:30, atk:55 },
  "嬬黒突貫":     { t:"none", k:"槍馬", per:6, atk:60 },
  "天虎招雷":     { t:"none", k:"槍馬", per:8, atk:80 },

  //--------------------------------
  //  槍砲攻
  //--------------------------------
  "橙武者":      { t:"none", k:"槍砲", per:12.5, atk:10 },
  "槍陣 弧月":   { t:"none", k:"槍砲", per:35, atk:20, des:10 },
  "月光麒麟":    { t:"none", k:"槍砲", per:25, atk:25, des:5 },
  "七槍の武":    { t:"none", k:"槍砲", per:30, atk:25 },
  "夢幻の慈愛":  { t:"rank", k:"槍砲", per:18, atk_b:30, atk_r:2 },
  "大願幽夢":    { t:"none", k:"槍砲", per:25, atk:28 },
  "姫鬼戦舞":    { t:"none", k:"槍砲", per:30, atk:30, des:25 },
  "范可咬撃":    { t:"none", k:"槍砲", per:30, atk:35 },
  "三段撃 烈火": { t:"cost", k:"槍砲", per:15, atk_r:9 },
  "武運長久":    { t:"cost", k:"槍砲", per:15, atk_r:9, des_b:5 },
  "浪切":        { t:"none", k:"槍砲", per:30, atk:37 },
  "銃槍竜騎兵":  { t:"none", k:"槍砲", per:30, atk:40 },
  "美濃の蝮":    { t:"mamushi", k:"槍砲", per_r:2, atk:42 },
  "煉獄天焦":    { t:"goryu_eff", k:"槍砲", per_b:25, atk_b:25, atk_r:2},

  //--------------------------------
  //  槍器攻
  //--------------------------------
  "七槍の智": { t:"none", k:"槍器", per:35, des:25 },
  "天下剛断": { t:"none", k:"槍器", per:20, atk:5, des:20 },
  "神算鬼謀": { t:"none", k:"槍器", per:10, des:30 },
  "足軽軍法": { t:"cost", k:"槍器", per:15, atk_r:9 },

  //--------------------------------
  //  弓馬攻
  //--------------------------------
  "慙愧の酒":   { t:"none", k:"弓馬", per:20, atk:15 },
  "中入り":     { t:"none", k:"弓馬", per:100, atk:18, desc:"防御側の敵襲察知を遅らせる" },
  "啄木鳥":     { t:"none", k:"弓馬", per:20, atk:20, des:5 },
  "虎舞燦爛":   { t:"none", k:"弓馬", per:20, atk:20, des:5 },
  "黄竜麒麟児": { t:"none", k:"弓馬", per:32, atk:20 },
  "天真蘭丸":   { t:"none", k:"弓馬", per:26, atk:30, des:10 },
  "都忘れ":     { t:"cost", k:"弓馬", per:15, atk_r:9 },
  "反骨の尖兵": { t:"none", k:"弓馬", per:32, atk:37 },
  "鳳凰馬藺":   { t:"none", k:"弓馬", per:24, atk:47 },
  "海神ノ破糾": { t:"none", k:"弓馬", per:35, atk:60 },
  
  //--------------------------------
  //  弓砲攻
  //--------------------------------
  "四風賢鳳":   { t:"none", k:"弓砲", per:20, atk:10 },
  "上忍遁甲":   { t:"none", k:"弓砲", per:30, atk:15, des:15 },
  "三段撃ち":   { t:"none", k:"弓砲", per:20, atk:20, des:5 },
  "弓砲連撃":   { t:"none", k:"弓砲", per:30, atk:20 },
  "弓砲鱗撃":   { t:"none", k:"弓砲", per:35, atk:20 },
  "弓撃慈雨":   { t:"none", k:"弓砲", per:28, atk:22 },
  "鉄砲術明光": { t:"none", k:"弓砲", per:32, atk:23, des:5 },
  "君子中庸":   { t:"none", k:"弓砲", per:32, atk:25 },
  "百万一心":   { t:"none", k:"弓砲", per:35, atk:25 },
  "餓狼関白":   { t:"none", k:"弓砲", per:35, atk:25 },
  "覇道弓赤鳥": { t:"none", k:"弓砲", per:42, atk:32 },
  "夜叉の円舞": { t:"none", k:"弓砲", per:30, atk:33 },
  "傾天の嘆き": { t:"none", k:"弓砲", per:30, atk:35 },
  "悠久豊国":   { t:"yukyu", k:"弓砲", per_b:35, atk_b:40, atk_r:1.5 },

  /*
  //--------------------------------
  //  弓器攻
  //--------------------------------
  //名前,条件,対象,確率,攻撃,防御,破壊,速度,備考
  {"火竜の術", "", "弓器", 35, 0, 0, 25, 0, ""},
  {"天下剛断", "", "弓器", 20, 5, 0, 20, 0, ""},
  {"夢想宴舞", "", "弓器", 10, 0, 0, 30, 0, ""},
  {"謀神", "", "弓器", 15, 9, 0, 0, 0, ""},
  {"天廟斬算", "敵武将20", "弓器", 35, 34, 0, 0, 0, "(1.7×防御参加武将数)%上昇"},
  {"天廟斬算", "敵武将100", "弓器", 35, 170, 0, 0, 0, "(1.7×防御参加武将数)%上昇"},
  {"天廟斬算", "敵武将180", "弓器", 35, 306, 0, 0, 0, "(1.7×防御参加武将数)%上昇"},
  
  //--------------------------------
  //  馬砲攻
  //--------------------------------
  //名前,条件,対象,確率,攻撃,防御,破壊,速度,備考
  {"馬上砲術", "", "馬砲", 60, 15, 0, 0, 0, ""},
  {"馬砲連撃", "", "馬砲", 30, 20, 0, 0, 0, ""},
  {"三鱗竜騎兵", "", "馬砲", 30, 20, 0, 0, 0, ""},
  {"虎砲英主", "", "馬砲", 30, 20, 0, 0, 0, ""},
  {"洗礼の旗印", "", "馬砲", 35, 25, 0, 0, 0, ""},
  {"玄狐跳澗", "", "馬砲", 30, 30, 0, 0, 0, ""},
  {"焔 六冥銭", "", "馬砲", 30, 30, 0, 0, 0, ""},
  {"旋風轟撃", "", "馬砲", 35, 30, 0, 0, 0, ""},
  {"猿夜叉", "", "馬砲", 35, 30, 0, 10, 0, ""},
  {"冥戦焔騎", "昼", "馬砲", 12, 39, 0, 0, 0, "20時～翌02時は確率3倍"},
  {"冥戦焔騎", "夜", "馬砲", 36, 39, 0, 0, 0, "20時～翌02時は確率3倍"},
  {"成香 雀刺", "", "馬砲", 10, 40, 0, 0, 0, ""},
  {"武神 火車懸", "", "馬砲", 17, 38, 0, 0, 0, ""},
  {"天戒 五芒星", "", "馬砲", 35, 40, 0, 0, 0, ""},
  */
  
  //--------------------------------
  //  馬器攻
  //--------------------------------
  "馬廻御奉行": { t:"none", k:"馬器", per:12, atk:8.5, des:8 },
  "鬼美濃":     { t:"none", k:"馬器", per:16, atk:14, des:10 },
  "驍将奇略":   { t:"none", k:"馬器", per:35, atk:25, des:20 },
  
  //--------------------------------
  //  砲器攻
  //--------------------------
  "詭謀の宴":   { t:"none", k:"砲器", per:50, atk:15 },
  "雑賀式絡繰": { t:"none", k:"砲器", desc:"※情報なし"},
  "甲州流兵学": { t:"none", k:"砲器", per:40, atk:20 },
  "太虚国崩し": { t:"none", k:"砲器", per:25, atk:35, des:30 },
  "天襲懸撃":   { t:"none", k:"砲器", per:27, atk:53, des:36 },

  /*
  //--------------------------------
  //  槍弓馬攻
  //--------------------------------
  //名前,条件,対象,確率,攻撃,防御,破壊,速度,備考
  {"傾奇戦国一", "", "槍弓馬", 30, 20, 0, 0, 0, ""},
  {"攻め弾正", "", "槍弓馬", 35, 20, 0, 15, 0, ""},
  {"礼の八犬士", "", "槍弓馬", 40, 20, 0, 0, 0, ""},
  {"甲虎襲踏", "", "槍弓馬", 30, 25, 0, 0, 0, ""},
  {"戦華白虎", "", "槍弓馬", 30, 25, 0, 0, 0, ""},
  {"紅蓮赤備", "", "槍弓馬", 30, 25, 0, 0, 0, ""},
  {"車懸り 白狐", "", "槍弓馬", 20, 30, 0, 0, 0, ""},
  {"手負い獅子", "", "槍弓馬", 20, 30, 0, 10, 0, ""},
  {"五山無双", "", "槍弓馬", 20, 30, 0, 10, 0, ""},
  {"越龍滅閃", "", "槍弓馬", 25, 30, 0, 0, 0, ""},
  {"滅覇渾身", "", "槍弓馬", 30, 30, 0, 5, 0, ""},
  {"風林火山 戦", "", "槍弓馬", 35, 30, 0, 0, 0, ""},
  {"神将", "", "槍弓馬", 35, 30, 0, 0, 0, ""},
  {"忠勇義烈", "", "槍弓馬", 40, 30, 0, 20, 0, ""},
  {"風林火山", "", "槍弓馬", 45, 30, 0, 15, 0, ""},
  {"無双獅子", "", "槍弓馬", 45, 30, 0, 35, 0, ""},
  {"地黄八幡 真", "", "槍弓馬", 30, 32, 0, 0, 0, ""},
  {"龍祖昇躍", "", "槍弓馬", 30, 35, 0, 0, 0, ""},
  {"赤鬼刺", "コスト1", "槍弓馬", 15, 12, 0, 0, 0, "武将のコストで効果が変化します"},
  {"赤鬼刺", "コスト4", "槍弓馬", 15, 48, 0, 0, 0, "武将のコストで効果が変化します"},
  {"飛将 蜻蛉切", "コスト1", "槍弓馬", 25, 12, 0, 0, 0, "武将のコストで効果が変化します"},
  {"飛将 蜻蛉切", "コスト4", "槍弓馬", 25, 48, 0, 0, 0, "武将のコストで効果が変化します"},
  {"無双蜻蛉切", "コスト1", "槍弓馬", 40, 13, 0, 0, 0, "武将のコストで効果が変化します"},
  {"無双蜻蛉切", "コスト4", "槍弓馬", 40, 52, 0, 0, 0, "武将のコストで効果が変化します"},
  {"修羅の援兵", "単独", "槍弓馬", 25, 25, 0, 0, 0, "合流攻撃時は効果2倍"},
  {"修羅の援兵", "合流", "槍弓馬", 25, 50, 0, 0, 0, "合流攻撃時は効果2倍"},
  {"三山統一", "", "槍弓馬", 16, 52, 0, 0, 0, ""},
  {"雷斬仁将", "敵武将20", "槍弓馬", 60, 52, 0, 0, 0, "発動率＝確率(3%)×防御武将数"},
  {"雷斬仁将", "敵武将34", "槍弓馬", 100, 52, 0, 0, 0, "発動率＝確率(3%)×防御武将数"},
  {"刀八毘沙門天", "1部隊", "槍弓馬", 20, 65, 0, 0, 0, "合流攻撃時は必ずスキル発動"},
  {"刀八毘沙門天", "合流", "槍弓馬", 100, 65, 0, 0, 0, "合流攻撃時は必ずスキル発動"},
  {"天征相克", "", "槍弓馬", 50, 70, 0, 0, 0, ""},
  */
  //--------------------------------
  //  槍弓砲攻
  //--------------------------------
  //名前,条件,対象,確率,攻撃,防御,破壊,速度,備考
  "館神":       { t:"none", k:"槍弓砲", per:50, atk:18 },
  "三河魂":     { t:"none", k:"槍弓砲", per:35, atk:25, des:25 },
  "不屈の名士": { t:"none", k:"槍弓砲", per:30.5, atk:33 },
  "常世虫":     { t:"none", k:"槍弓砲", per:26, atk:37 },
  
  //--------------------------------
  //  槍弓器攻
  //--------------------------------
  "神算鬼謀 滅": { t:"cost", k:"槍弓器", per:50, atk_b:10, atk_r:4, des:26 },
  /*
  //--------------------------------
  //  槍馬砲攻
  //--------------------------------
  //名前,条件,対象,確率,攻撃,防御,破壊,速度,備考
  {"綾羅錦繍", "", "槍馬砲", 30, 17, 0, 0, 0, ""},
  {"風流雷火", "", "槍馬砲", 35, 20, 0, 0, 0, ""},
  {"風流嵐舞", "", "槍馬砲", 25, 25, 0, 0, 0, ""},
  {"竜眼月影", "", "槍馬砲", 25, 25, 0, 10, 0, ""},
  {"七槍の勇", "", "槍馬砲", 30, 25, 0, 0, 0, ""},
  {"貴煌豊国", "", "槍馬砲", 30, 25, 0, 0, 0, ""},
  {"剛勇無双", "", "槍馬砲", 30, 25, 0, 0, 0, ""},
  {"九曜激昂", "", "槍馬砲", 25, 27, 0, 0, 0, ""},
  {"覇道 不如帰", "", "槍馬砲", 30, 30, 0, 30, 0, ""},
  {"声遣縦横", "", "槍馬砲", 24, 38, 0, 0, 0, ""},
  {"鬼五郎左", "", "槍馬砲", 26, 38, 0, 0, 0, ""},
  {"黒鬼刺", "コスト1", "槍馬砲", 15, 10, 0, 0, 0, "武将のコストで効果が変化します"},
  {"黒鬼刺", "コスト4", "槍馬砲", 15, 40, 0, 0, 0, "武将のコストで効果が変化します"},
  {"七難八苦の誓", "敵武将20", "槍馬砲", 25, 30, 0, 0, 0, "(1.5×防御参加武将数)%上昇"},
  {"七難八苦の誓", "敵武将100", "槍馬砲", 25, 150, 0, 0, 0, "(1.5×防御参加武将数)%上昇"},
  {"七難八苦の誓", "敵武将180", "槍馬砲", 25, 270, 0, 0, 0, "(1.5×防御参加武将数)%上昇"},
  */
  //--------------------------------
  //  槍馬器攻
  //--------------------------------
  "双頭蛇 国盗": { t:"none", k:"槍馬器", per:27, atk:25 },
  "鬼神轟雷":    { t:"none", k:"槍馬器", per:25, atk:27 },
  
  //--------------------------------
  //  弓馬砲攻
  //--------------------------------
  "軍神強襲":   { t:"none", k:"弓馬砲", per:20, atk:25 },
  "青海の騎将": { t:"none", k:"弓馬砲", per:30, atk:30 },
  
  //--------------------------------
  //  弓馬器攻
  //--------------------------------
  "浅井一文字": { t:"none", k:"弓馬器", per:45, atk:35 },
  
  //--------------------------------
  //  弓砲器攻
  //--------------------------------
  "炮烙の計":   { t:"none", k:"弓砲器", per:15, atk:20, des:15 },
  "船団爆雷" :  { t:"none", k:"弓砲器", per:25, atk:30, des:10 },
  "気丈な覚悟": { t:"none", k:"弓砲器", per:100, atk:50, desc:"戦闘敗北時は自軍兵士被害数＋25%"},

  //--------------------------------
  //  馬砲器攻
  //--------------------------------
  //名前,条件,対象,確率,攻撃,防御,破壊,速度,備考
  "独眼竜":      { t:"none", k:"馬砲器", per:30, atk:25, des:5 },
  "戦陣 風雷火": { t:"none", k:"馬砲器", per:20, atk:44, des:32 },
  "独眼竜咆哮":  { t:"none", k:"馬砲器", per:30, atk:35, des:20 },
  "破軍星":      { t:"cost", k:"馬砲器", per:40, atk_b:18, atk_r:8, des_b:8, des_r:3 },

  //--------------------------------
  //  槍弓馬砲攻
  //--------------------------------
  "虎牙猛撃":    { t:"none", k:"槍弓馬砲", per:33, atk:20 },
  "進撃 四獣操": { t:"none", k:"槍弓馬砲", per:30, atk:25 },
  "鳳凰炎舞":    { t:"none", k:"槍弓馬砲", per:25, atk:26 },
  "日本の副王":  { t:"none", k:"槍弓馬砲", per:30, atk:26 },
  "義兵進軍":    { t:"none", k:"槍弓馬砲", per:100, atk:7, spd:10 },

  //--------------------------------
  //  槍馬砲器攻
  //--------------------------------
  "猛虎咆哮": { t:"none", k:"槍馬砲器", per:45, atk:10, des:40 },
  "般若強襲": { t:"none", k:"槍馬砲器", per:40, atk:12, des:40 },

  //--------------------------------
  //  上級器攻
  //--------------------------------
  "鬼謀 国砕": { t:"none", k:"上級器", per:35, atk:10, des:25 },
  "赤誠奮迅":  { t:"none", k:"上級器", per:33, atk:12, des:23.5 },

  //--------------------------------
  //  秘境兵攻
  //--------------------------------
  "常山女軍": { t:"none", k:"秘境兵", per:20, atk:30 },

  /*
  //--------------------------------
  //  全攻
  //--------------------------------
  //名前,条件,対象,確率,攻撃,防御,破壊,速度,備考
  {"車懸り", "", "全", 15, 30, 0, 0, 0, ""},
  */
};