window.onload = function(){
	//getStyle函数
	function getStyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj,false)[attr];
		}
	}
	//焦点图整理思路
	//左右按钮加切换和焦点同步效果-->焦点点击切换和样式跟随效果-->父级盒子移入移出自动播放和暂停效果
	//各种可修改配置的参数在这里定义
	var len = 5;//真实图片的个数，不包含首尾虚拟图片
	var animated = false;//判断是否执行动画，默认未执行
	var index = 1;//设置初始焦点选中第一个焦点
	var timer = null;//初始化一个定时器
	var interval = 3000;//设置切换间隔时间
    var step = 600;//设置每次移动的步幅
	//第一步，获取元素
	//父级容器元素，为了后面设置移入移出自动播放和暂停效果
	var container = document.getElementById('container');
	//图片列表元素，为了后面设置其left值达到切换效果
    var list = document.getElementById('list');
    //焦点元素，为了后面设置焦点点击换切效果
    var buttons = document.getElementById('buttons').getElementsByTagName('span');
    //左按钮，添加向前预览效果
    var prev = document.getElementById('prev');
    //右按钮，添加向后预览效果
    var next = document.getElementById('next');


	//第二步，写banner切换效果
	function animate(offset){//offset是banner每一次位移距离，可以为正数或负数，为0表示不执行动画
		if(offset == 0){
			return;
		}
		animated = true;//调用animate函数将动画置为false
		//要做动画，首要因素动画的执行速度，v = s/t
		//s就是offset，t自己设置，快慢可以自己调试
		var t = 30;
		var speed = offset/t;
		var interval = 10;
		
		//要使动画一帧一帧地切换，每一步都有个终点位置
		var left = parseInt(list.style.left) + offset;
		//要想动画每隔一段时间执行一次，递归函数+setTimeout()结合使用是不错的选择
		var go = function(){
			//如果满足条件动画开开始
			//首先判断你要做的是向左还是向右移动，和是否达到终点
			if((speed < 0 && parseInt(list.style.left) > left) || (speed > 0 && parseInt(list.style.left) < left)){
				//切换的实质是什么，就是改变图片列表的left值
				list.style.left = parseInt(list.style.left) + speed + 'px';
				//移动一次怎么行，还没到终点，那要继续，但是要是每一次间隔在视觉上看起来像连续的，时间应设置比较小
				setTimeout(go,interval);//interval可以作为可变参数设置
				if((speed < 0 && parseInt(list.style.left) - left < speed) || (speed > 0 && left - parseInt(list.style.left) < speed)){
					list.style.left = left;
				}
			}//不满足条件动画不执行
			else{			
				animated = false;//结束后，将动画状态置为false
				//要使之连续滚动，滚动到第一张和最后一张要做些处理
				if(left > -step){//如果终点在虚拟的第五张上面，就把他切换到真实的第五张上
					list.style.left = -step * len + 'px';
				}
				if(left < -step * len){
					list.style.left = -step + 'px';
				}
			}
		}
		go();
	}


	//第三步，写焦点同步样式效果
	function showButton(){
		//先遍历焦点，重置样式，为什么要加判断，性能优化，当遍历到类on元素时，便停止查找，否则会继续做无用功
		for(var i = 0;i < buttons.length;i++){
			if(buttons[i].className == 'on'){
				buttons[i].className = '';
				break;
			}
		}
		//再加样式
		buttons[index - 1].className = 'on';
	}


	//第四步，对象添加事件
	//对左右按钮添加事件
	next.onclick = function(){
		if(animated){
			return;
		}
		if(index == 5){
			index = 1;
		}else{
			index++;
		}
		animate(-step);
		showButton();
	}
	prev.onclick = function(){
		if(animated){
			return;
		}
		if(index == 1){
			index = 5;
		}else{
			index--;
		}
		animate(step);
		showButton();
	}
	//对焦点加事件
	for(var j = 0;j < buttons.length;j++){
		buttons[j].onclick = function(){
			if(this.className == 'on'){
				return;
			}
			if(animated){
				return;
			}
			//要使图片同步切换，必须知道你现在点击的点，和需要执行动画的位移
			var myIndex = this.getAttribute('index');
			var offset = -step * (myIndex - index);
			animate(offset);
			index = myIndex;
			showButton();
		}
	}

	//函数载入执行默认动画
	//自动播放
	var play = function(){
		timer = setTimeout(function(){
			next.onclick();
			play();
		},interval);
	}//暂停
	var stop = function(){
		clearTimeout(timer);
	}
	container.onmouseover = stop;
    container.onmouseout = play;
	//载入自动播放
	play();
}