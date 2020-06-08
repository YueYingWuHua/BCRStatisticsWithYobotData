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
	   let myH4 = document.createElement('h4');
	   myH4.textContent = getNameByQQ(jsonObj, qq)+'的离职证明';
	   myArticle.appendChild(myH4);
	   header.appendChild(myArticle);
	   return result
   }
   

