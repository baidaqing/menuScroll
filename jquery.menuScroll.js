/*
 * jQuery 菜单滚动导航
 *
 * @version 1.0.0
 *
 * 使用示例:
 * $('.menu').menuScroll({
 *   currentClass:'current',
 *    nav:'a',
 *	 showThreshold:0.5
 * });
 */

(function($,window,document){
	function menuScroll(elem,options)
	{
		this.el=elem;
		this.$el=$(elem);
		this.$win=$(window);
		this.$doc=$(document);
		this.blocks={};
		this.options=options;
	}

	menuScroll.prototype=
	{
		settings:{
			currentClass:'current',
			nav:'a',
			showThreshold:0.5

		},
		init:function()
		{
			this.settings=$.extend({},this.settings,this.options);
			this.$nav=this.$el.find(this.settings.nav);
			this.$nav.on('click',$.proxy(this.navClick,this));
			this.getBlockPositions();
			this.bindInterVal();
		},
		findBlock:function(scollTop)
		{
			var self=this;
			var returnValue;
			var windowHeight = Math.round(self.$win.height() * self.settings.showThreshold);
			for(var item in self.blocks)
			{
				if(self.blocks[item]-windowHeight <scollTop)
				{
					returnValue=item;
				}
			}
			return returnValue;
		},
		setNavSelected:function($el)
		{
			var self=this;
			var cclass=this.settings.currentClass;
			self.$el.find("."+cclass).removeClass(cclass);
			$el.parent().addClass(this.settings.currentClass);
		},
		unbindInterVal:function()
		{
			var self=this;
			clearInterval(self.s);
			self.$win.unbind('scroll');

		},
		bindInterVal:function()
		{
			var self=this;
			self.$win.on('scroll',function(){
				self.startScroll=true;
			});
			self.s=setInterval(function(){
				if(self.startScroll)
				{
					//计算滚动条高度
					var scrollTop=self.$win.scrollTop();
					//找到定位块
					var block=self.findBlock(scrollTop);
					//设置高亮
					var nav=$("[href=#"+block+"]");
					self.setNavSelected(nav);
				}
			},500);
		},
		getBlockPositions:function()
		{
			var self=this;
			self.$nav.each(function(){
				 var link=$(this).attr("href");
				 var blockid=link.split('#')[1];
				 var top=$("#"+blockid).offset().top;
				 self.blocks[blockid]=top;

			});

		},
		scrollToBlock:function(blockId,callback)
		{
			var currentOffsetTop=$("#"+blockId).offset().top;
			$('html,body').animate({scrollTop:currentOffsetTop},750,'swing',function(){
				callback();
			});
		},
		navClick:function(e)
		{
			var self=this;
			var link=e.target;
			var blockId=$(link).attr("href");
			blockId=blockId.split('#')[1];
			self.unbindInterVal();
			self.scrollToBlock(blockId,function(){
				self.bindInterVal();
			});
		}
	}
	
	$.fn.menuScroll=function(){
		var options=arguments[0];
		return this.each(function(){
			return (new menuScroll(this,options)).init();
		});

	}
})(jQuery,window,document);