   let header = document.querySelector('header');
   let section = document.querySelector('section');
   var file = 'json/20200607.json'   
	   
   function getJsonData() {
	   let requestURL = 'json/20200607.json';
	   let request = new XMLHttpRequest();
	   request.open('GET', requestURL);
	   request.responseType = 'text';
	   request.send();	   

	   request.onload = function() {
	       let text = request.response;
	       let json = JSON.parse(text);
	       console.log(json)
	       	       
	   };	   
   }
 
   function getQQByName(jsonObj, name) {
	   let members = jsonObj['members']
	   for (i = 0; i < members.length; i++) {
		   if (members[i].nickname == name)
			   return members[i].qqid			  
	   }
	   return "N/A"
   }
   
   function getNameByQQ(jsonObj, qq) {
	   let members = jsonObj['members']
	   for (i = 0; i < members.length; i++) {
		   if (members[i].qqid == qq)
			   return members[i].nickname			  
	   }
	   return 0
   }
   
   /**
    * 根据原始数据值获取每个用户的每个boss总伤害。
    * @param jsonObj
    * @returns Map[QQ号，伤害数组]
    */   
   function getAllUserDamage(jsonObj) {
	   let challenges = jsonObj['challenges'];
	   //包含30个qq对应的全部伤害数组
	   //0-4 对应一周目一二三四五王，5-9对应二+周目一二三四五王
	   var dmgMap = new Map();
	   for (i = 0; i < challenges.length; i++) {
           let qqid = challenges[i].qqid;
           let cycle = 0;
           if (challenges[i].cycle > 1) cycle = 1;
           var remainValuedDmg = challenges[i].damage
           if ((challenges[i].health_ramain == 0)||(challenges[i].is_continue)) remainValuedDmg = remainValuedDmg * 1.1
           if (dmgMap.get(qqid) != null){        	   
        	   dmgMap.get(qqid)[cycle * 5 + challenges[i].boss_num - 1] += remainValuedDmg
           } else {
        	   var arr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
        	   arr[cycle * 5 + challenges[i].boss_num - 1] += remainValuedDmg
        	   dmgMap.set(qqid, arr)
           }
	   }
	   return dmgMap
   }
   
   function getAllDamagedPlayer(dmgMap, jsonObj) {	   
	   var dmgPlayer = new Array()
	   for (let [qqid, dmgArr] of dmgMap){
		   let name = getNameByQQ(jsonObj, qqid)
		   dmgPlayer.push({ "name": name, "qqid": qqid})
	   }
	   return dmgPlayer
   }
 
   /**
    * 根据每个用户的总伤害，以及权重，算出每个用户的权重分值    
    * @param dmgMap
    * @param valueMap
    * @returns Map[qqid, 权重分数组]
    */
   function getWeightedDmg(dmgMap, valueMap) {
	   var weightedDmgMap = new Map();
   	   for (let [qqid, dmgArr] of dmgMap) {
   	   	   let qqWeightedDmgArr = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
           for(i = 0; i < 10; i++){
			   qqWeightedDmgArr[i] = dmgArr[i] * valueMap[i] 
		   }
		   weightedDmgMap.set(qqid, qqWeightedDmgArr)
       }
	   return weightedDmgMap
   }
   
   /**
    * 根据每个boss的伤害算出来每个boss刀均伤害
    * @param jsonObj
    * @returns 伤害数组
    */
   function getAvgDmg(jsonObj) {
	   let challenges = jsonObj['challenges'];
	   var totalDmg = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
	   var count = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
	   for (i = 0; i < challenges.length; i++) {
		   let cycle = 0;
           if (challenges[i].cycle > 1) cycle = 1;
           //不超过20W的刀没必要统计，不符合统计规律
           if ((challenges[i].damage > 200000)&&(challenges[i].health_ramain > 0)&&(!challenges[i].is_continue)){
        	   totalDmg[cycle * 5 + challenges[i].boss_num - 1] += challenges[i].damage
        	   count[cycle * 5 + challenges[i].boss_num - 1] += 1
           }
	   }
	   var avgDmg = new Array(10)
	   for (i = 0; i < 10; i++){
		   if (count[i] > 0)
			   avgDmg[i] = totalDmg[i]/count[i]
	   } 
	   return avgDmg 
   }
   
   /**
    * 根据平均伤害算出不同Boss的权值系数
    * ∑avg
    * @param avgDmg
    * @returns 权值数组
    */
   function generateValue(avgDmg) {
	   let totalDmg = 0
	   avgDmg.map(dmg => {
		   totalDmg += dmg
	   })
	   return avgDmg.map(dmg => {
		   return 1/(dmg*10/totalDmg)
	   })
   }
      
   function statisticPlayerByBoss(jsonObj, qq) {	   
	   let challenges = jsonObj['challenges'];	   
	   console.log('进入分析流程')
	   console.log(challenges)
	   var result = new Array(new Array(),new Array(),new Array(),new Array(),new Array())
	   var maxDamage = new Array(new Array(0, 0, 0, 0, 0), new Array(0, 0, 0, 0, 0))
	   for (i = 0; i < challenges.length; i++) {
		   let cycle = 0
		   if (challenges[i].cycle > 1) cycle = 1		   
		   if (challenges[i].damage > maxDamage[cycle][challenges[i].boss_num - 1]){
			   maxDamage[cycle][challenges[i].boss_num - 1] = challenges[i].damage
		   }
	   }
	   console.log(maxDamage[0])
	   console.log(maxDamage[1])
	   for (i = 0; i < challenges.length; i++) {
           let qqid = challenges[i].qqid;
           if (qqid == qq){
        	   let cycle = 0
    		   if (challenges[i].cycle > 1) cycle = 1 
        	   result[challenges[i].boss_num - 1].push(
        			   {'score': challenges[i].damage*100/maxDamage[cycle][challenges[i].boss_num - 1], 'damage': challenges[i].damage, 'cycle-time': challenges[i].cycle+'周目:'+new Date(parseInt(challenges[i].challenge_time) * 1000).toLocaleString()}
        			   )
           }

	   }
	   let myArticle = document.createElement('article');
	   let myH4 = document.createElement('h1');
	   myH4.textContent = getNameByQQ(jsonObj, qq)+'的离职证明';
	   myArticle.appendChild(myH4);
	   header.appendChild(myArticle);
	   return result
   }
   

