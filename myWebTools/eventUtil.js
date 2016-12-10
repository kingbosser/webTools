//添加事件
function addHandler(element,type,handler){
	if(element.addEventListener){
		element.addEventListener(type,handler,false);
	}
	else if(element.attachEvent){
		element.attachEvent('on'+type,handler);
	}
	else{
		element['on'+type] = handler;
	}
}
// 删除事件
function removeHandler(element,type,handler){
	if(element.removeEventListener){
		element.removeEventListener(type,handler,false);
	}
	else if(element.detachEvent){
		element.detachEvent('on'+type,handler);
	}
	else{
		element['on'+type] = null;
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
// 阻止事件冒泡
function stopPropagation(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
}
// 获取event
function getEvent(event){
	return event?event:window.event;
}
//获取事件类型
function getType(event){
	return event.type;
}
//获取事件对象
function getElement(event){
	return event.target || event.srcElement;
}