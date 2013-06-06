
## PhotoSwipe

- [source](https://github.com/jayli/photoswipe)
- by 拔赤
- [Demo](http://mobile.kissyui.com/direct.php?type=demo&name=photoswipe)

基本场景：用于图集展示的相册控件

![](http://img04.taobaocdn.com/tps/i4/T1mSm1XzBdXXaE3eMM-440-660.jpg)

### 使用

	KISSY.use('mobile/photoswipe/1.0/',function(S,Photoswipe){
		// 初始化
		var photoswipe = new Photoswipe();
		// 填充数据
		photoswipe.addData({
			items:[
				{pic:'',title:''},
				{pic:'',title:''}
			]
		});
		// 显示
		photoswipe.show();
	});

### API

#### 构造参数

	new Photoswipe({
		imgPadding:20,// 图片距离视口边界的最小距离,默认为0
		id:'MyId',// 相册容器的ID，可留空
		overflow:false, // 图片过大是否超出视口范围
		data:{ // 初始数据
			items:[{pic:'',title:''},...]
		},
		nextAtlas:false, // 是否可加载下一图集
		loadMoreHtml:'<div class="ps-loadmore ps-pal">加载下一图集</div>', // 下一图集的提示
		conClass:'myClass' //相册容器的className
	});

*imgPadding*

图片距离视口边界的最小距离，默认为0

*id*

相册容器的id，可以留空，默认为一个随机id

*data*

初始数据对象，默认为空，可留空，手动通过photoswipe.addData(data)添加数据，数据格式必须为

	{ items:[
		{pic:'url',title:''},
		{pic:'url',title:''}
		...
	]}

*nextAtlas*

布尔值，是否还有下一图集，默认为false

*loadMoreHtml*

加载更多的提示，可以留空，默认样式为(css需要外部添加)

![](http://img03.taobaocdn.com/tps/i3/T1Xo52XvxcXXaE3eMM-440-660.jpg)

#### 方法

*handleImgMarginTop(srcNode)*

将图片定位在视口垂直中央，srcNode为传入的img节点

*isVisiable()*

无参数，返回当前相册是否处于显示状态

*addData(items)*

添加一个图集的数据，数据格式同上data

*prev()*

显示上一张图,如果在第一张图，则进入到最后一张图

*next()*

显示下一张图,如果在最后一张图，则进入第一张图

*getIndex()*

得到当前图片的序列值

*setIndex(index)*

设置当前图片的序列值

*show()*

显示相册

*hide()*

隐藏相册

*hasNextAtlas(flag)*

设置相册有下一个图集
	
	hasNextAtlas(true)

设置相册无下一个图集

	hasNextAtlas(false)

得到当前相册是否有下一图集

	hasNextAtlas()


#### 事件

*edgeSwipe*

到最后一张图时，如果有下一个图集，再要滑动加载下一张图时触发，回传page参数为图集的序号

	ps.on('edgeSwipe',function(e){
		alert(e.page);//要加载下一个图集的序号	
	});

*imgLoaded*

每张图片加载完成时触发，回传img参数，为刚加载完成的图片节点

	ps.on('imgLoaded',function(e){
		alert(e.img);//	加载完成的图片节点，通常在这里处理宽高
	});
	

