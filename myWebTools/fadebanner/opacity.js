window.onload = function(){
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
  //淡入处理函数
  function fadeIn(elem){ 
    setOpacity(elem,0); //初始全透明
    for(var i = 0;i<=20;i++){ //透明度改变 20 * 5 = 100
      (function(){ 
        var level = i * 5;  //透明度每次变化值
        setTimeout(function(){ 
          setOpacity(elem, level)
        },i*50); //i * 25 即为每次改变透明度的时间间隔，自行设定
      })(i);     //每次循环变化一次
    }
  }

    //淡出处理函数
  function fadeOut(elem){ 
    for(var i = 0;i<=20;i++){ //透明度改变 20 * 5 = 100
      (function(){ 
        var level = 100 - i * 5; //透明度每次变化值
        setTimeout(function(){ 
          setOpacity(elem, level)
        },i*50); //i * 25 即为每次改变透明度的时间间隔，自行设定
      })(i);     //每次循环变化一次
    }
  }

  // //fadeIn函数
  // function fadein(ele, opacity, speed) {
  //     if (ele) {
  //         var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;
  //         v < 1 && (v = v * 100);
  //         var count = speed / 1000;//除以1000毫秒，单位为1s
  //         var avg = count < 2 ? (opacity / count) : (opacity / count - 1);
  //         var timer = null;
  //         timer = setInterval(function() {
  //             if (v < opacity) {
  //                 v += avg;
  //                 setOpacity(ele, v);
  //             } else {
  //                 clearInterval(timer);
  //             }
  //         }, 500);
  //     }
  // }
  // //fadeout函数
  // function fadeout(ele, opacity, speed) {
  //     if (ele) {
  //         var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
  //         v < 1 && (v = v * 100);
  //         var count = speed / 1000;
  //         var avg = (100 - opacity) / count;
  //         var timer = null;
  //         timer = setInterval(function() {
  //             if (v - avg > opacity) {
  //                 v -= avg;
  //                 setOpacity(ele, v);
  //             } else {
  //                 clearInterval(timer);
  //             }
  //         }, 500);
  //     }
  // }
  var curIndex = 0, //当前index
      imgArr = getByClass("imgList")[0].getElementsByTagName("li"), //获取图片组
      imgLen = imgArr.length,
      infoArr = getByClass("infoList")[0].getElementsByTagName("li"), //获取图片info组
      indexArr = getByClass("indexList")[0].getElementsByTagName("li"); //获取控制index组
     // 定时器自动变换2.5秒每次
  var autoChange = setInterval(function(){ 
    if(curIndex < imgLen -1){ 
      curIndex ++; 
    }else{ 
      curIndex = 0;
    }
    //调用变换处理函数
    changeTo(curIndex); 
  },2500);
  //调用添加事件处理
  addEvent();    
//其中的changeTo就是处理函数，addEvent就是给右下角的那些按钮设定事件处理
//变换处理函数
  function changeTo(num){ 
    //设置image
    var curImg = getByClass("imgOn")[0];
    fadeOut(curImg); //淡出当前 image
    removeClass(curImg,"imgOn");    
    addClass(imgArr[num],"imgOn");
    fadeIn(imgArr[num]); //淡入目标 image
    
    //设置image 的 info
    var curInfo = getByClass("infoOn")[0];
    removeClass(curInfo,"infoOn");
    addClass(infoArr[num],"infoOn");
    //设置image的控制下标 index
    var _curIndex = getByClass("indexOn")[0];
    removeClass(_curIndex,"indexOn");
    addClass(indexArr[num],"indexOn");
  }
 //给右下角的图片index添加事件处理
 function addEvent(){
  for(var i=0;i<imgLen;i++){ 
    //闭包防止作用域内活动对象item的影响
    (function(_i){ 
    //鼠标滑过则清除定时器，并作变换处理
    indexArr[_i].onmouseover = function(){ 
      clearInterval(autoChange);
      changeTo(_i);
      curIndex = _i;
    };
    //鼠标滑出则重置定时器处理
    indexArr[_i].onmouseout = function(){ 
      autoChange = setInterval(function(){ 
      if(curIndex < imgLen -1){ 
        curIndex ++;
      }else{ 
        curIndex = 0;
      }
    //调用变换处理函数
      changeTo(curIndex); 
    },2500);
    };
     })(i);
  }
}
}