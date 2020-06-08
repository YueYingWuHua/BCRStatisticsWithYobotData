<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<style>
  h4 {
    text-align: center;
    height:8%;
  }
  p {
    text-align: justify;
    text-align: center;
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
<head>    
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />    
    <title>离职证明页</title>
    <link href="https://fonts.googleapis.com/css?family=Faster+One" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
</header>

<body>
	<div style="overflow-y: scroll;border: 1;width: 100%;height: 92%">
		<div>
			<p>人生有梦，后面的爷忘了</p>
		</div>	
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
			    <h2>猪</h2>
			    <div id="b3Scroll" style="height:100%"></div>	    
			</div>
			<div class="oneCard">	    
			    <h2>鹿</h2>
			    <div id="b4Scroll" style="height:100%"></div>	    
			</div>
		</div>
		<div class="fullCard">	
			<div class="oneCard">	    
			    <h2>牛</h2>
			    <div id="b5Scroll" style="height:100%"></div>	    
			</div>
		</div>		
	</div>
</body>

<script src="js/GetData.js"></script>
<script src="echarts/echarts.js"></script>
<script src="js/readStatisticsJson.js"></script>
<script type="text/javascript">
	var mydata = getjson()
	console.log(mydata)
	var result = statisticPlayerByBoss(mydata, 385118693)
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
    
</script>
</body>
</html>
