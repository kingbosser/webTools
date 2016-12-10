
	//函数执行区域
	//示例：functionname();
	// 阻止事件冒泡
      function stopPropagation(event){
        if(event.stopPropagation){
          event.stopPropagation();
        }else{
          event.cancelBubble = true;
        }
      }
      // 阻止事件默认行为
      function preventDefault(event){
        if(event.preventDefault){
          event.preventDefault();
        }else{
          event.returnValue = false;
        }
      }

	// 所有工具函数
	//完美版getByclass函数
	function getByClass(sClass,parent){
		var oParent = parent?document.getElementById(parent):document;
		    eles = [];
		    elements = oParent.getElementsByTagName("*");
		    re = new RegExp('\\b'+sClass+'\\b', 'i');//i表示不区分大小写
		for(var i = 0,l = elements.length;i < l;i++){
			if(re.test(elements[i].className)){
  				 eles.push(elements[i]);
 			}
		}
		return eles;
	}
	//hasClass函数
	function hasClass(obj, cls){  
		var obj_class = obj.className;//获取 class 内容.  
		var obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.  
		for(var i = 0;i < obj_class_lst.length;i++){
			if(obj_class_lst[i] == cls){
				return true;
			}
		}
		return false;
	}
	//addClass函数
	function addClass(obj, cls){
    	if (!hasClass(obj, cls)) obj.className += " " + cls;
	}
	//removeClass函数
	function removeClass(obj, cls) {
    	if (hasClass(obj, cls)) {
       		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        	obj.className = obj.className.replace(reg, ' ');
    	}
	}
	//setOpacity函数
	function setOpacity(ele, opacity){
    	if(ele.style.opacity != undefined){
        	///兼容FF和GG和新版本IE
        	ele.style.opacity = opacity / 100;
    	} else {
        	///兼容老版本ie
        	ele.style.filter = "alpha(opacity=" + opacity + ")";
    	}
	}
	//fadeIn函数
	function fadein(ele, opacity, speed) {
   		if (ele) {
        	var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;
        	v < 1 && (v = v * 100);
        	var count = speed / 1000;//除以1000毫秒，单位为1s
        	var avg = count < 2 ? (opacity / count) : (opacity / count - 1);
        	var timer = null;
        	timer = setInterval(function() {
            	if (v < opacity) {
                	v += avg;
                	setOpacity(ele, v);
            	} else {
                	clearInterval(timer);
            	}
        	}, 500);
    	}
	}
	//fadeout函数
	function fadeout(ele, opacity, speed) {
    	if (ele) {
        	var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
        	v < 1 && (v = v * 100);
        	var count = speed / 1000;
        	var avg = (100 - opacity) / count;
        	var timer = null;
        	timer = setInterval(function() {
            	if (v - avg > opacity) {
                	v -= avg;
                	setOpacity(ele, v);
            	} else {
                	clearInterval(timer);
            	}
        	}, 500);
    	}
	}
	//getStyle函数
	function getStyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj,false)[attr];
		}
	}
	//运动框架
	function startMove(obj,json,fn){  
    	//停止上一次定时器  
    	clearInterval(obj.timer);  
    	//保存每一个物体运动的定时器  
    	obj.timer = setInterval(function(){  
        	//判断同时运动标志  
        	var bStop = true;  
        	for(var attr in json){    
            	//取当前值    
            	var iCur = 0;  
            	if(attr == 'opacity'){  
                	iCur = parseInt(parseFloat(getStyle(obj, attr))*100);  
           		}else{  
                	iCur = parseInt(getStyle(obj,attr));  
            	}  
            	//计算速度  
            	var iSpeed = (json[attr] - iCur) / 8;  
            	iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);  
            	//检测同时到达标志  
            	if(iCur != json[attr]){  
                	bStop = false;  
            	}     
            	//更改属性，获取动画效果  
            	if(attr=='opacity'){  
                	iCur += iSpeed  
                	obj.style.filter='alpha(opacity:' + iCur + ')';  
                	obj.style.opacity=iCur / 100;  
            	}  
            	else{  
                	obj.style[attr]=iCur+iSpeed+'px';  
            	}  
        	}  
        	//检测停止  
        	if(bStop){  
            	clearInterval(obj.timer);  
            	if(fn) fn();  
        	}  
    	},30)  
	}
