window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
if (typeof window.AudioContext != 'undefined') {
	var audio = document.getElementById('audio');
	var ctx = new AudioContext();
	var analyser = ctx.createAnalyser();
	var audioSrc = ctx.createMediaElementSource(audio);
	audioSrc.connect(analyser);
	analyser.connect(ctx.destination);
	var cvs = document.getElementById('cvs');
	cvs.width = document.body.clientWidth;
	cvs.height = document.body.clientHeight;
	var cwidth = cvs.width,
		cheight = cvs.height,
		meterWidth = 12, //柱宽
		gap = 4, //柱间距
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
		ctx.clearRect(0, 0, cwidth, cheight);
		for (var i = 0; i < meterNum; i++) {
			var value = array[i * step];
			if (capYPositionArray.length < Math.round(meterNum)) {
				capYPositionArray.push(value);
			}
			ctx.fillStyle = capStyle;
			//draw the cap, with transition effect
			if (value < capYPositionArray[i]) {
				ctx.fillRect(i * (meterWidth + gap), cheight - (--capYPositionArray[i]), meterWidth, capHeight);
			} else {
				ctx.fillRect(i * (meterWidth + gap), cheight - value, meterWidth, capHeight);
				capYPositionArray[i] = value;
			}
			ctx.fillStyle = '#90c400'; //set the filllStyle to gradient for a better look
			ctx.fillRect(i * (meterWidth + gap), cheight - value + capHeight, meterWidth, cheight); //the meter
			// ctx.fillStyle = 'rgba(255, 255, 255, 0)';
			// ctx.setAttribute('width',window.innerWidth);
			// ctx.setAttribute('height',window.innerHeight);
			ctx.width = cwidth;
			ctx.height = cheight;
		}
		requestAnimationFrame(renderFrame);
	}

	renderFrame();
	audio.play();
}