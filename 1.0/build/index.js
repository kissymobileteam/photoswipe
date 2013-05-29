/*
combined files : 

gallery/photoswipe/1.0/index

*/
/**
 * @fileoverview 请修改组件描述
 * @author bachi<bachi@taobao.com>
 * @module photoswipe
 **/

KISSY.add('mobile/photoswipe/1.0/index',function (S,Slide,Mask,Juicer) {

	"use strict";

	function PhotoSwipe(id,cfg) {
		if (this instanceof PhotoSwipe) {

			this.con = S.one(id);

			PhotoSwipe.superclass.constructor.call(this, cfg);
			this.init();

		} else {
			return new PhotoSwipe(id,cfg);
		}
	}

	// TODO 2013-05-29
	//	1,双指放大缩小
	//	2,辅助菜单和导航
	//	3,辅助文字的显示

	// ATTR Example
	PhotoSwipe.ATTRS = {
		id:{
			value:'PhotoSwip-'+S.now()
		},
		// 划过的帧是否被删除掉
		slideOptimize:{
			value: true
		},
		// 图片超过屏幕尺寸时，按照屏幕尺寸来渲染
		overflow:{
			value:false
		},
		// TODO
		// 双指放大缩小功能
		zoom: {
			value:false
		},
		// 真实page从0,1,2开始
		page:{
			value: 0
		},
		/*
		 * {
		 *		c1:'',
		 *		c2:''
		 *		...
		 * }
		 * */
		caches:{
			value:{}
		},
		// 相册图片池
		data:{
			value: {
				items:[
					{pic:'',title:''},
					{pic:'',title:''}
				]
			}
		},
		nextAtlas:{
			value:false
		},
		// 得到下一个图集
		getNextAtlas:{
			value: function(index,flag,callback){
				
			}
		},
		itemHtml:{
					 value:['<div class="ps-pal ${placeholder}">',
						 '<div class="ps-pic-wrapper">',
						 '<img src="${pic}" class="ps-pic" />',
						 '</div>',
						 '	<!--img class="ps-loading" src="http://img03.taobaocdn.com/tps/i3/T1Ou9TXCFdXXaPT2Hb-24-24.gif" /-->',
						 '</div>'].join('')
		},
		wrapperHtml:{
			value:[
				'<div id="${id}">',
				'	<div class="ps-con">',
				'		$${items}',
				'	</div>',
				'</div>'].join('')
		},
		loadMoreHtml:{
			 value:['<div class="ps-loadmore ps-pal">',
				 '<div class="ps-loadmore-img">',
				 '</div>',
				 '</div>'].join('')
		},
		conClass:{
			value:''
		}
	};

	S.extend(PhotoSwipe, 
			S.Base,{

		init: function() {
			// your code here
			var that = this;
			that.initParam();
			that.createHtml();
			that.slide = new Slide(that.id,{
				conClass:that.conClass,
				autoSlide:false,
				effect:'hSlide',
				touchmove:true,
				adaptive_fixed_width:true,
				contentClass:'ps-con',
				speed:250,
				pannelClass:'ps-pal',
				animWrapperAutoHeightSetting:false,
				webkitOptimize:true,
				adaptive_width:function(){
					return S.DOM.viewportWidth();
				},
				adaptive_height:function(){
					return S.DOM.viewportHeight();
				}
			});
			that.mask = Mask({
				opacity:0.6
			}); 
			that.bindEvent();
			
		},
		// 定位到viewport中央
		// 只操心高度的居中定位，不操心宽度居中
		handleImgMarginTop: function(srcNode){
			var that = this;
			var node  = srcNode;
			if(!node){
				return;
			}
			setTimeout(function(){
				if(that.overflow === false){
					if(node.width() > S.DOM.viewportWidth()){
						node.width(S.DOM.viewportWidth());
					}
					if(node.height() > S.DOM.viewportHeight()){
						node.height(S.DOM.viewportHeight());
					}
				}
				var height = node.height();
				var marginTop = (S.DOM.viewportHeight() - height) / 2;
				node.css({
					'margin-top':(marginTop) + 'px'	
				});
			},100);
		},
		// 是否显示
		isVisiable:function(){
			var that = this;
			return that.con.css('display') == 'none'? false:true;
		},
		/*
		 * items 格式：
		 * [
		 * 		{
		 *			pic:'',
		 *			title:''
		 * 		},
		 * 		...
		 *
		 * ]
		 **/
		addData:function(items){
			var that = this;
			that.data.items = that.data.items.concat(items);
			that.set('data',that.data);
			S.each(items,function(v,k){
				that.slide.add(Juicer(that.itemHtml,v));
			});
			var placeholder = that.con.one('.ps-placeholder');
			placeholder && placeholder.remove();
			that.page ++;
			that.set('page',that.page);
			if(that.isVisiable()){
				that.resetImgAlign();
			}
			// that.replaceLoadMore();
		},
		// 滑块窗口内保持，窗口外的节点都清空
		slipperFilter:function(){
			var that = this;
			var pannels = that.slide.pannels;
			for(var i = 0;i<that.slide.length;i++){
				var el = S.one(pannels[i]);
				if(el.hasClass('ps-loadmore')){
					continue;
				}
				if(el.children().length != 0){
					that._rememberPannel(i);
				}
				if(i < that.slide.currentTab - 1 || i > that.slide.currentTab + 1){
					that._emptyPannel(i);
				} else {
					that._recallPannel(i);
				}
			}

		},
		_rememberPannel:function(i){
			var that = this;
			var el = S.one(that.slide.pannels[i]);
			that.caches['c'+i] = el.html();
			that.set('caches',that.caches)
		},
		// 清空pannel
		_emptyPannel:function(i){
			var that = this;
			var el = S.one(that.slide.pannels[i]);
			if(el.children().length != 0){
				that._rememberPannel(i);
			}
			el.empty();
		},
		//恢复pannel
		_recallPannel:function(i){
			var that = this;
			var el = S.one(that.slide.pannels[i]);
			var html = that.caches['c'+i];
			if(html){
				el.html(html);
				if(that.slide.currentTab !== i){
					that.handleImgMarginTop(el.one('.ps-pic'));
				}
			}
		},
		prev: function(callback){
			var that = this;
			that.slide.previous.call(that.slide,callback);
		},
		next: function(callback){
			var that = this;
			that.slide.next.call(that.slide,callback);
		},
		createHtml: function(){
			var that = this;
			var itemsHtml = Juicer(that.itemHtml,{
				pic:'',
				placeholder:'ps-placeholder'
			});
			var wrapperHtml = Juicer(that.wrapperHtml,{
				id:that.id,
				items:itemsHtml
			});
			that.con = S.Node(wrapperHtml);
			that.con.css({
				display:'none',
				left:0,
				top:0,
				width:S.DOM.viewportWidth(),
				height:S.DOM.viewportHeight(),
				position:'fixed',
				'z-index':10001
			});
			S.one('body').append(that.con);

		},
		initParam:function(){
			var that = this;
			S.each(PhotoSwipe.ATTRS,function(v,k){
				that[k] = that.get(k);
			});
		},
		// index，显示第几张图片
		show:function(index){
			var that = this;
			if(that.con.css('display') == 'block'){
				return;
			}
			that.con.css({
				display:'block'	
			});
			if(!S.isUndefined(index)){
				that.slide.go(index,false);
			}
			that.mask.addMask();
			that.resetImgAlign();
			if(that.con.attr('data-ps') !== 'true'){
				that.bindExitEvent();
				that.con.attr('data-ps','true');
			}
		},
		resetImgAlign:function(){
			var that = this;
			that.slide.con.all('img.ps-pic').each(function(v,k){
				if(v.attr('data-cultop') == 'true'){
					return;
				}
				that.handleImgMarginTop(v);	
				v.attr('data-cultop','true');
			});
		},
		hide: function(){
			var that = this;
			that.con.css({
				display:'none'	
			});
			that.mask.removeMask();
		},
		bindExitEvent:function(){
			var that = this;
			that.slide.pannels.on('click',function(e){
				if(S.one(e.target).hasClass('ps-pic')){
					return;
				}
				that.hide();
			});
		},
		bindEvent: function(){
			var that = this;
			that.slide.on('beforeSwitch',function(e){
				if(!that.slide.is_last()){
					// 滑动过程中调整后续图片的居中显示
					for(var i = that.slide.currentTab;i<that.slide.length;i++){
						var el = S.one(that.slide.pannels[i]).one('img.ps-pic');
						el && that.handleImgMarginTop(el);
					}
				}
				if(that.slide.currentTab == that.slide.length - 2){
					if(that.hasNextAtlas()){
						that.fire('edgeSwipe',{
							page:that.page
						});
						setTimeout(function(){
							if(!that.hasNextAtlas()){
								that.next();
							}
						},30);
						return false;
					}
				}
			});
			if(that.slideOptimize){
				that.slide.on('afterSwitch',function(e){
					that.slipperFilter();
				});
			}

		},
		_detachEvent:function(){

		},
		// flag
		hasNextAtlas:function(flag){
			var that = this;
			if(S.isUndefined(flag)){
				return that.nextAtlas;
			}
			that.set('nextAtlas',flag);
			that.nextAtlas = flag;
			that._replaceLoadMore();
		},
		_replaceLoadMore:function(){
			var that = this;
			var loadmore = that.con.one('.ps-loadmore');
			if(that.hasNextAtlas()){
				if(loadmore){
					that._moveLoadMore();
				} else {
					that.slide.add(that.loadMoreHtml);
					that.handleImgMarginTop(that.con.one('.ps-loadmore-img'));
				}
			} else {
				// that._moveLoadMore();
				loadmore && that.slide.remove(that.slide.currentTab);
			}
		},
		_moveLoadMore:function(){
			var that = this;
			var loadmore = that.con.one('.ps-loadmore');
			loadmore.css({
				visibility:'hidden'	
			});
			loadmore.appendTo('body').appendTo(that.slide.animwrap);
			loadmore.css({
				visibility:'visible'	
			});
		},

		destory: function(){

		}
	});

	return PhotoSwipe;

}, {
	requires: [
		'gallery/slide/1.1/',
		'mobile/simple-mask/1.0/',
		'gallery/juicer/1.3/',
		'base',
		'node'
	]
});

