<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
<style>
  h1 {
    text-align: center;  
    text-align: justify;
  }
  p {
    text-align: justify;
    text-align: center;
  }
  h2 {
  	text-align: justify;
  	margin-left: 8%
  }
  .links {
    margin-right: 20px;
    text-align: left;
  }
  .fullCard {
  	display: flex;
    width: 80%;
    height: 40%;
    margin-left: 5%;
  }  
  .statisticCard {
  	display: flex;
    width: 80%;
    height: 100%;
    margin-left: 5%;
  } 
  .oneCard {
  	width: 50%;
  	height: 100%;
  	margin: 10px;
  }
  footer{
    width:100%;
    height:100px;
    position:absolute;
    left:0;
    bottom:0;
  } 
  body,html{
	margin:0 0 0 0;
	overflow:hidden hidden;
  }
</style>

<header>
</header>

<head>    
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />    
    <title>统计页面</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<main style="overflow-y: scroll;border: 1;width: 100%;height: 92%">
	<div>
		<h2>权值分数统计</h2>
		<div class="statisticCard">				
			<div id="statisticsScroll" style="height:100%;width:100%"></div>	    
		</div>		
		<h2>伤害详情页</h2>
		<form action="/ResignationPage" style="margin-left:10%">
			<input type="text" placeholder="350977030">
			<button type="submit">查找QQ号</button>
		</form>		
		<div class="fullCard">
			<div class="oneCard">	    
			    <h2>龙</h2>
			    <div id="b1Scroll" style="height:100%"></div>	    
			</div>
		    <div class="oneCard">	    
			    <h2>鸟</h2>
			    <div id="b2Scroll" style="height:100%"></div>	    
			</div>
		</div>
		<div class="fullCard">
			<div class="oneCard">	    
			    <h2>花</h2>
			    <div id="b3Scroll" style="height:100%"></div>	    
			</div>
			<div class="oneCard">	    
			    <h2>巨人</h2>
			    <div id="b4Scroll" style="height:100%"></div>	    
			</div>
		</div>
		<div class="fullCard">	
			<div class="oneCard">	    
			    <h2>双子猪</h2>
			    <div id="b5Scroll" style="height:100%"></div>	    
			</div>
		</div>
	</div>
</main>

<script src="js/GetData.js"></script>
<script src="echarts/echarts.js"></script>
<script src="js/readStatisticsJson.js"></script>
<script type="text/javascript">
	var mydata = getjson()
	console.log(mydata)
	var result = statisticPlayerByBoss(mydata, 350977030)
	for (i = 0; i < result.length; i++){
		for (j = 0; j < result[i].length; j++)
			console.log(result[i][j])
	}
		
    option = {
        dataset: {
            source: result[4]
        },
        grid: {containLabel: true},
        xAxis: {name: 'damage'},
        yAxis: {type: 'category'},
        visualMap: {
            orient: 'horizontal',
            left: 'center',
            min: 10,
            max: 100,
            text: ['High Score', 'Low Score'],
            // Map the score column to color
            dimension: 0,
            inRange: {
                color: ['#D7DA8B', '#E15457']
            }
        },
        series: [
            {
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'damage',
                    // Map the "product" column to Y axis
                    y: 'cycle-time'
                }
            }
        ]
    };
    for (i = 0; i < 5; i++){
    	var j=i+1
    	var b1Chart = echarts.init(document.getElementById('b'+ j +'Scroll'));
    	option.dataset.source=result[i]
    	b1Chart.setOption(option);
    }
        
    var avgDmg = getAvgDmg(mydata)
    var valueArr = generateValue(avgDmg)
    var dmgMap = getAllUserDamage(mydata)
    var weightedDmg = getWeightedDmg(dmgMap, valueArr)   
    var dmgPlayer = getAllDamagedPlayer(dmgMap, mydata)
    var weightedDmgArr = Array.from(weightedDmg)
    var dataNameArr = new Array('一周目龙', '一周目鸟', '一周目花', '一周目巨人', '一周目双子猪', '2+周目龙', '2+周目鸟', '2+周目花', '2+周目巨人', '2+周目双子猪')    
    var seArr = new Array()    
    for (i = 0; i < 10; i++){    	
    	seArr.push({ 
    		name: dataNameArr[i],
            type: 'bar',
            stack: '伤害',
            label: {
                show: false,
                position: 'insideRight'
            },
            data: weightedDmgArr.map(arr => {return arr[1][i]})
    	})
    }
    statisticsOption = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	        data: dataNameArr
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'value'
	    },
	    yAxis: {
	        type: 'category',
	        data: dmgPlayer.map(data => {return data.name+"("+data.qqid+")"})
	    },
	    series: seArr
	};
    
    var stChart = echarts.init(document.getElementById("statisticsScroll"));	
    stChart.setOption(statisticsOption);
</script>
</body>
</html>
