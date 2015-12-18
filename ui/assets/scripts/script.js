var slider;
var userObj = {};
var resultingData;
var WIN = $(window);
var DOC = $(document);
var countdownTimer;
var slider;
var paused;
var sunTick = .04
$(function() {
	var sunTop = 0;

	var particleInterval = setInterval(function(){
		if(!paused){
			$('.particles').append('<div class="particle"></div>')
			$('.particle').eq($('.particle').length-100).remove();
			$('.particle').eq($('.particle').length-1).css({
				'-webkit-transform': 'translate('+(Math.random()*(WIN.width()/4)-(WIN.width()/4)/2)+'px,'+(Math.random()*(WIN.height()/4)-(WIN.height()/2)/2)+'px)'
			})
			if(sunTop < 240){
				sunTop += sunTick;
				$('.particles').css({
					top: sunTop
				})
			}
		}
	},20)

	WIN.on('keydown',function(){
		paused = true;
		setTimeout(function(){
			paused = false;
		},1000)
	})
	if(window.location.hash) {
	  var timelineId = window.location.hash.split('#')[1];
	  placeHashes()
	  WIN.on('resize',placeHashes)
	  setWindowWidth();
		getTimeline(timelineId);
	}
	else{
		placeHashes()
		WIN.on('resize',placeHashes)
		$('.slider').on('mousedown',startDrag)
		$('.slider').on('touchstart',startDrag)
		var youTimeout;
		var sonTimeout;
		$('.your-name span').on('keydown',function(){
			$('.content').addClass('isTyped')
			resetField($(this))
		})
		$('.your-name').on('keyup',function(){
			clearTimeout(youTimeout);
			youTimeout = setTimeout(function(){
				$('.content').addClass('isYouName')
			},500)
		})
		$('.son-name').on('keypress',function(e){
			if(e.keyCode == 13){
				continueClick();
			}
			clearTimeout(sonTimeout);
			sonTimeout = setTimeout(function(){
				$('.content').addClass('isSonName')
			},500)
		})
		$('.continue').on('click',continueClick)
		$('.your-name span').focus();
		$('.name span').on('click',function(e){
			resetField()
			$('.content').addClass('isTyped')
		})
		$('.son-name span').on('focus',function(){
			var name = $(this)
			setTimeout(function(){
				name.prop('selectionStart', 0)
				resetField(name)
			},300)
		})
		function resetField(el){
			if(el.text() == 'What is your name?'){
				el.html('')
			}
			console.log(el.text())
			if(el.text() == 'What did you name your son?'){
				el.html('')
			}
			
		}
		function continueClick(){
			if(!$('.content').hasClass('isYouName')){
				$('.content').addClass('isYouName')
			}else if(!$('.content').hasClass('isBothNames')){
				$('.content').addClass('isBothNames')
				changeTagline('How many years have<br> you been on Earth?')
				userObj.sonName = $('.son-name span').text();
				userObj.dadName = $('.your-name span').text();
			}else{
				//TREVOR THIS IS THE FINAL CONTINUE. SUBMIT HERE
			}
		}
		function startDrag (e) {
			e.preventDefault();
			slider = $(this)
			WIN.on('mousemove',onMove)
			WIN.on('touchmove',onMove)
			WIN.on('mouseup',onRelease)
			WIN.on('touchend',onRelease)
		}
		function onMove (e) {
			var x;
			if(e.type == 'touchmove'){
				x = e.originalEvent.touches[0].pageX;
			}else{
				x = e.pageX
			}
			if(slider.hasClass('you-slider')){
				$('.content').addClass("isMovingYouAge");
				var width = x - slider.offset().left;
			}else{
				$('.content').addClass("isMovingSonAge");
				$('.content').addClass('isWindow')
				var width = (WIN.width() - x - WIN.width()/10) - (WIN.width()-$('.you-slider').width() - (WIN.width() - $('.timeline').width()));
				userObj.index = x;
				
				setWindowWidth();
			}
			slider.find($('.age')).html(Math.max(0,Math.floor(80*(width/$('.timeline').width()))));
			slider.css({
				width: Math.max(5,Math.min($('.timeline').width(),width))
			})
		}
		function onRelease (e) {
			WIN.off('mousemove')
			WIN.off('touchmove')
			WIN.off('mouseup')
			WIN.off('touchend')
			if(slider.hasClass('you-slider')){
				changeTagline('How many years have<br> you been on Earth <span class="window-years">with '+userObj.sonName+'?</span>')	
				$('.content').addClass("isSonAge");
				$('.son-slider').css({
					right: WIN.width() - $('.you-slider').width() - (WIN.width() - $('.timeline').width()) - $('.son-slider .age').width()/2
				})
			}else{
				changeTagline(userObj.dadName+' and '+userObj.sonName+' have<br><span class="window-years">' + (18-Number($('.son-slider').find($('.age')).text()))+' more years together.</span>')
				$('.window-slider').find($('.bar')).addClass('blink');
				userObj.dadAge = $('.you-slider .age').text();
				userObj.sonAge = $('.son-slider .age').text();
				// console.log(userObj)
				saveTimeline();
				setWindowWidth();
				clearTimeout(countdownTimer)
				countdownTimer = setTimeout(function(){
					$('.content').addClass('isCountdown');
					sunTick = 1;
				},3000)
			}
		}
		function setWindowWidth(){
			// $('.window-slider').find($('.your-age')).html(Math.max(Number($('.you-slider').find($('.age')).text()),18-Number($('.son-slider').find($('.age')).text())+Number($('.you-slider').find($('.age')).text())))
			$('.window-slider').css({
				width: $('.timeline').width()*((18-$('.son-slider').find($('.age')).text())/80),
				left: $('.you-slider').width()
			});
		}
		function changeTagline (message) {
			$('.tagline').css({
				'-webkit-transition-duration':'1s',
				'-webkit-filter':'blur(10px) opacity(0%)'
			})
			setTimeout(function(){
				$('.tagline').html(message)
				$('.tagline').css({
					'-webkit-transition-duration':'1s',
					'-webkit-filter':'blur(0px) opacity(100%)'
				})
			},1000)
		}
		function placeHashes(){
			for (var i = $('.hash').length - 1; i >= 0; i--) {
				$('.hash').eq(i).css({
					left: i*$('.timeline').width()/8
				})
			};
		}
	}
})
