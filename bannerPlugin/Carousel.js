;(function($){
	// 构造函数
	var Carousel = function(poster){
		var self = this;
		//保存单个轮播对象
		this.poster = poster;
		this.carouselList = poster.find("ul.carouselList");
		this.prevBtn = poster.find("div.prevBtn");
		this.nextBtn = poster.find("div.nextBtn");
		this.posterItems = poster.find("li.carouseItem");
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		this.focus = poster.find("div.focus");
		this.focusItem = poster.find("div.focus span");
		this.focusFirstItem = this.focusItem.first();
		this.focusLastItem = this.focusItem.last();
		this.rotateFlag   = true;
		//默认配置参数
		this.settings = {
			"carouselStyle":"slide",//轮播样式：滑动、渐隐
			"width":600,//盒子宽度
			//"height":400,//盒子高度
			"speed":1000,//轮播切换速度
			"autoPlay":true,//是否自动播放
			"delay":2000,//自动播放间隔时间
			"btnshow":true,//按钮是否显示
			"focusshow":true//图片焦点是否显示
		};
		$.extend(this.settings,this.getSetting());
		this.setSettingValue();
		this.nextBtn.click(function(){
			if(self.rotateFlag === true){
				self.rotateFlag = false;
				self.carouseRotate("right");
			}		
		});
		this.prevBtn.click(function(){
			if(self.rotateFlag === true){
				self.rotateFlag = false;
				self.carouseRotate("left");
			}
		});
		this.focusItem.each(function(){
			var _self = $(this);
			_self.click(function(){
				if(self.settings.carouselStyle === "fade"){
					var cIndex = _self.index();
					if(self.posterItems.eq(cIndex).css("display") != "list-item"){				
						self.posterItems.eq(cIndex).fadeIn(self.settings.speed)
						.siblings().fadeOut(self.settings.speed);
					}else{
						return;
					};
					if(!self.focusItem.eq(cIndex).hasClass("active")){
						self.focusItem.eq(cIndex).addClass("active")
						.siblings().removeClass("active");
					}else{
						return;
					};
				}else if(self.settings.carouselStyle === "slide"){
					var sIndex =_self.index();
					self.focusItem.eq(sIndex).addClass("active").siblings().removeClass("active");
					self.carouselList.animate({
						left:"-"+(sIndex+1)*self.settings.width
					},self.settings.speed,function(){
						self.rotateFlag = true;
					})
				}
			});
		});
		if(this.settings.autoPlay){
			this.autoPlay();
			this.poster.hover(function(){
				window.clearInterval(self.timer);
			},function(){
				self.autoPlay();
			});	
		};
	};


	// 原型
	Carousel.prototype = {
		//自动播放
		autoPlay:function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},this.settings.delay);
		},
		//旋转
		carouseRotate:function(dir){
			var _this_ = this;
			if(this.settings.carouselStyle === "fade"){
				var iNow = 0;
				this.posterItems.each(function(){
					var self = $(this);
					var currentStyle = self.css("display");
					if(currentStyle === "list-item"){
						iNow = self.index();
					}
				});	
				//点击右键，向左切换
				if(dir === "right"){	
					_this_.posterItems.eq(iNow).fadeOut(_this_.settings.speed);
					var next = _this_.posterItems.eq(iNow).next().get(0)?_this_.posterItems.eq(iNow).next():_this_.posterFirstItem;	
					next.fadeIn(_this_.settings.speed,function(){
						_this_.rotateFlag = true;
					});
					var nextfocus = _this_.focusItem.eq(iNow).next().get(0)?_this_.focusItem.eq(iNow).next():_this_.focusFirstItem;
					_this_.focusItem.eq(iNow).removeClass("active");
					nextfocus.addClass("active");
				}else if(dir === "left"){		
					_this_.posterItems.eq(iNow).fadeOut(_this_.settings.speed);
					var prev = _this_.posterItems.eq(iNow).prev().get(0)?_this_.posterItems.eq(iNow).prev():_this_.posterLastItem;	
					prev.fadeIn(_this_.settings.speed,function(){
						_this_.rotateFlag = true;
					});
					var prevfocus = _this_.focusItem.eq(iNow).prev().get(0)?_this_.focusItem.eq(iNow).prev():_this_.focusLastItem;
					_this_.focusItem.eq(iNow).removeClass("active");
					prevfocus.addClass("active");					
				}
			}else if(this.settings.carouselStyle === "slide"){
				var wid = this.settings.width;
				var size = this.posterItems.size();
				if(dir === "right"){
					var numdex = parseFloat(this.carouselList.css("left"))/(-wid);
					if(numdex === _this_.posterItems.size()){
						numdex = 0;
					}
					this.focusItem.eq(numdex).addClass("active")
					.siblings().removeClass("active");
					this.carouselList.animate({
						left:"-="+this.settings.width
					},_this_.settings.speed,function(){
						_this_.rotateFlag = true;
						if(parseFloat(_this_.carouselList.css("left")) <= -wid*(size+1)){
							_this_.carouselList.css({
								left:-wid
							})
						};
					});
				}else if(dir === "left"){
					var numdex = parseFloat(this.carouselList.css("left"))/(-wid);
					if(numdex === 1){
						numdex = _this_.posterItems.size()+1;
					}
					this.focusItem.eq(numdex-2).addClass("active")
					.siblings().removeClass("active");
					this.carouselList.animate({
						left:"+="+this.settings.width
					},_this_.settings.speed,function(){
						_this_.rotateFlag = true;
						if(parseFloat(_this_.carouselList.css("left")) >= 0){
							_this_.carouselList.css({
								left:-wid*size
							})
						}
					});
				}
			}
		},
		//设置配置参数值
		setSettingValue:function(){
			var self = this;
			this.poster.css({
				width: this.settings.width,
				height: this.settings.height
			});
			if(this.settings.carouselStyle === "fade"){
				this.carouselList.css({
					width: this.settings.width,
					height: this.settings.height
				});
				this.posterItems.each(function(i){
					$(this).css({
						width:self.settings.width,
						height: self.settings.height,
						position:"absolute",
						left:0,
						top:0,
						zIndex: self.posterItems.size()-i,
						display:"none"
					})
				});
				this.posterItems.eq(0).css({
					display:"list-item"
				});
			};
			if(this.settings.carouselStyle === "slide"){
				this.carouselList.prepend(this.posterLastItem.clone(true));
				this.carouselList.append(this.posterFirstItem.clone(true));
				var w = this.settings.width;
				var h = this.settings.height;
				var newNode = this.poster.find("li.carouseItem");
				this.carouselList.css({
					left:-w,
					width:w*(this.posterItems.size()+2),
					height:h
				});
				newNode.each(function(){
					$(this).css({
						float:"left",
						width:w,
						height:h
					})
				});
			}
			this.prevBtn.css({
				width:this.settings.width*0.3,
				height:this.settings.height,
				zIndex:this.posterItems.size()+1
			});
			this.nextBtn.css({
				width:this.settings.width*0.3,
				height:this.settings.height,
				zIndex:this.posterItems.size()+1
			});
			this.focus.css({
				zIndex:this.posterItems.size()
			});
			if(this.settings.btnshow === false){
				this.prevBtn.css({
					display:"none"
				});
				this.nextBtn.css({
					display:"none"
				});
			};
			if(this.settings.focusshow === false){
				this.focus.css({
					display:"none"
				});
			};
		},
		//获取人工配置参数
		getSetting:function(){
			var set = this.poster.attr("data-settings");
			if(set && set != ""){
				return $.parseJSON(set);//将css属性转化为json对象
			}else{
				return {};
			};
		}	
	};


	//初始化
	Carousel.init = function(poster){
		var _this_ = this;
		poster.each(function(){
			new _this_($(this));
		})
	};
	//注册Carousel变量
	window["Carousel"] = Carousel;
})(jQuery);