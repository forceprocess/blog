var menu = new Vue({
	el: '#menu',
	data: {
		menus: [
			{'id': 1, 'title': '首页', 'icon': 'icon ion-ios-home'},
			{'id': 2, 'title': 'Oracle', 'icon': 'ion-android-globe'},
			{'id': 3, 'title': 'Java', 'icon': 'icon ion-coffee'},
			{'id': 4, 'title': 'Go', 'icon': 'icon ion-social-google'},
			{'id': 5, 'title': 'Node', 'icon': 'icon ion-social-nodejs'}
		],
		menuActive: 1
	},
	methods: {
		menuClick: function (item) {
			this.menuActive = item.id;
		}
	}
});

//文章
var vm = new Vue({
	el: '#article',
	data: {
		page: 1,
		row: 5,
		breadcrumb: [
			{'title': '首页', 'link': '#'},
			{'title': 'Java', 'link': '#'},
			{'title': 'Java多线程', 'link': '#'}
		],
		articles: [
			1, 2, 3, 4, 5
		]
	},
	methods: {
		toPage: function (page) {
			this.page += page;
		}

	}
});

var topContainer = new Vue({
	el: '#top-container',
	data: {
		top: false
	},
	mounted: function () {
		this.$nextTick(function () {
			document.onscroll = this.windowScroll;
		});
	},
	methods: {
		windowScroll: function (e) {
			this.top = window.pageYOffset > 10;
		},
		toTop: function () {
			window.scrollTo(0, 0);
		}
	}
});

//音乐背景
var musicBackground = new Vue({
	el: '#cvm-container',
	data: {
		canvas: {
			cvsWidth: 0,
			cvsHeight: 0
		}
	},
	mounted: function () {
		var _this = this;
		this.$nextTick(function () {
			_this.canvas.cvsWidth = document.body.clientWidth;
			_this.canvas.cvsHeight = document.body.clientHeight;

			_this.initCanvas();
			window.onresize = function () {
				_this.canvas.cvsWidth = document.body.clientWidth;
//					_this.canvas.cvsHeight = document.body.clientHeight;
			}
		});
	},
	methods: {
		initCanvas: function () {

			var _this = this;
			window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
			if (typeof window.AudioContext != 'undefined') {
				var audio = document.getElementById('audio');
				var ctx = new AudioContext();
				var analyser = ctx.createAnalyser();
				var audioSrc = ctx.createMediaElementSource(audio);
				audioSrc.connect(analyser);
				analyser.connect(ctx.destination);
				var cvs = document.getElementById('cvs');
				cvs.width = _this.canvas.cvsWidth;
				cvs.height = _this.canvas.cvsHeight;
				var meterWidth = 5, //柱宽
					gap = 5, //柱间距
					capHeight = 1,	//顶子的高度
					capStyle = '#474f4b',
					meterNum = 1500 / 10, //count of the meters
					capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
				ctx = cvs.getContext('2d');

				// loop
				function renderFrame() {
					var array = new Uint8Array(analyser.frequencyBinCount);
					analyser.getByteFrequencyData(array);
					var step = Math.round(array.length / meterNum); //sample limited data from the total array
					ctx.clearRect(0, 0, _this.canvas.cvsWidth, _this.canvas.cvsHeight);
					for (var i = 0; i < meterNum; i++) {
						var value = array[i * step];
						if (capYPositionArray.length < Math.round(meterNum)) {
							capYPositionArray.push(value);
						}
						ctx.fillStyle = capStyle;
						//draw the cap, with transition effect
						if (value < capYPositionArray[i]) {
							ctx.fillRect(i * (meterWidth + gap), _this.canvas.cvsHeight - (--capYPositionArray[i]), meterWidth, capHeight);
						} else {
							ctx.fillRect(i * (meterWidth + gap), _this.canvas.cvsHeight - value, meterWidth, capHeight);
							capYPositionArray[i] = value;
						}
						ctx.fillStyle = '#90c400'; //set the filllStyle to gradient for a better look
						ctx.fillRect(i * (meterWidth + gap), _this.canvas.cvsHeight - value + capHeight, meterWidth, _this.canvas.cvsHeight); //the meter
//							ctx.fillStyle = 'rgba(255, 255, 255, 0)';
					}
					requestAnimationFrame(renderFrame);
				}

				renderFrame();
				audio.play();
			}
		}
	}
});