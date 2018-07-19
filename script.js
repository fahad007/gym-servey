(function(){

	'use strict'

	// Global Variables

	var conditionData = {
			maleSkinnyFat: {
				segment: 1,
				macrogoal: 'maintenance',
				action: 'https://vshred.com/sp/survey/results-male-sf'
			},
			maleGetRipped: {
				segment: 2,
				macrogoal: 'maintenance',
				action: 'https://vshred.com/sp/survey/results-male-gr'
			},
			maleHardGainer: {
				segment: 3,
				macrogoal: 'build-muscle',
				action: 'https://vshred.com/sp/survey/results-male-cb'
			},
			maleFatLoss: {
				segment: 4,
				macrogoal: 'fat-loss',
				action: 'https://vshred.com/sp/survey/results-male-fl'
			},
			femaleFatLoss: {
				segment: 5,
				macrogoal: 'fat-loss',
				action: 'https://vshred.com/sp/survey/results-female-fl'
			},
			femaleGetToned: {
				segment: 6,
				macrogoal: 'maintenance',
				action: 'https://vshred.com/sp/survey/results-female-gt'
			},
			femaleSkinnyFat: {
				segment: 7,
				macrogoal: 'maintenance',
				action: 'https://vshred.com/sp/survey/results-female-sf'
			}
		},
		anotherField = [
				'utm_source',
				'utm_medium',
				'utm_campaign',
				'utm_term',
				'utm_content'
		],
		currnetPage = 0,
		highestPage = 0


	$(document).ready(function(){

		var form = $('[data-form]'),
			pages = $('.pages'),
			page = $('.page'),
			interval


		// Initialization

		function init(){
			$('.pages').height( $('.page').eq(currnetPage).height() )
			$('.page-status span').eq(0).addClass('active')
		}

		init()

		function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        // Submit Form

        function submitForm(condition) {

        	form.find( 'input[name=segment]').val(conditionData[condition].segment )
        	form.find( 'input[name=macrogoal]').val(conditionData[condition].macrogoal )
        	form.attr( 'action', conditionData[condition].action )

        	anotherField.forEach(function(name){
        		form.find('input[name=' + name + ']').val(getParameterByName(name))
        	})

            form.submit()

        }

        // Next Page

        function nextPage(el, value = ''){

			if( ! el.data('next') ){
				el.closest('[data-submit]').length && submitForm(value)
				// console.log(currnetPage/(page.length - 1))
	        	if( currnetPage/(page.length - 1) < 1 ){
	        		el.closest('[data-page]').hide().next().show()
	        	}
			}else{
	        	if(currnetPage >= highestPage) return
				$('[data-page]').eq(currnetPage).hide()
				$('[data-page]').eq(currnetPage+1).show()
			}

			currnetPage++
			
			if(highestPage <= currnetPage){
				highestPage = currnetPage
				$('.next-button').addClass('disable')
			}

			var farction = currnetPage/(page.length - 1)
			
			if( farction <= 1 ) {
				$('.pages').height( $('.page').eq(currnetPage).height() )
				$('.page-status span').removeClass('active after-active')
				$('.page-status span').eq(currnetPage - 1).nextAll().addClass('after-active')
				$('.green-line').css('transform', 'scaleX(' + farction + ')')
				setTimeout(function(){
					$('.page-status span').eq(currnetPage).addClass('active')
				},1000)
				if(currnetPage == 0){
					$('.data-progress').css('opacity', '0')
				}else{
					$('.data-progress').css('opacity', '1')
				}
				clearInterval(interval)

				var f = (currnetPage-1)/page.length,
					time = f*100,
					count = 0

				$('[data-progress]').html(Math.round(time))
				interval = setInterval(function(){
					count++
					time += (50 * 100) / (page.length * 1000)
					$('[data-progress]').html(Math.round(time))
					console.log('jtiu')
					if(count >= (1000/50)){ clearInterval(interval); }
				},50)
				
			}
			
        }

        // Previous Page

        function previousPage(){
        	if(currnetPage <= 0) return

			$('[data-page]').eq(currnetPage).hide()
			$('[data-page]').eq(currnetPage - 1).show()
			currnetPage--
			$('.pages').height( $('.page').eq(currnetPage).height() )
			$('.page-status span').removeClass('active after-active')
			$('.page-status span').eq(currnetPage).nextAll().addClass('after-active')
			var fraction = currnetPage/(page.length - 1)
			$('.green-line').css('transform', 'scaleX(' + fraction + ')')
			setTimeout(function(){
				$('.page-status span').eq(currnetPage).addClass('active')
			},1000)
			$('.next-button').removeClass('disable')
			if(currnetPage == 0){
				$('.data-progress').css('opacity', '0')
			}else{
				$('.data-progress').css('opacity', '1')
			}
			// clearInterval(interval)

			// var time = fraction*100 + 20
			// $('[data-progress]').html(time)
			// interval = setInterval(function(){
			// 	time--
			// 	$('[data-progress]').html(time)
			// 	if(time <= fraction*100) clearInterval(interval)
				
			// },50)

			clearInterval(interval)

			var f = (currnetPage+1)/page.length,
				time = f*100,
				count = 0

			$('[data-progress]').html(Math.round(time))
			interval = setInterval(function(){
				count++
				time -= (50 * 100) / (page.length * 1000)
				$('[data-progress]').html(Math.round(time))
				if(count >= (1000/50)){ console.log(time); clearInterval(interval); }
			},50)
        }

        // Clicking Options

		$('[data-name]').on('click', function(){

			var $this = $(this),
				name = $this.data('name'),
				value = $this.data('value'),
				prevent = $this.attr('data-prevent-procced')


			form.find('input[name=' + name + ']').val(value)

			// Deciding to Add Female Class

			form.find('input[name=gender]').val() == 'female' ? pages.addClass('female') : pages.removeClass('female')


			if( $('[data-depend=' + name + ']').length ){
				$('[data-depend=' + name + ']').hide()
				$('[data-depend=' + name + '][data-if=' + value + ']').show()
			}

			if( !prevent ){
				nextPage($this, value)
			}else{
				$('[data-name]').removeClass('active')
				$this.addClass('active')
			}

		})

		// Clicking Continue Button

		$('[data-continue]').on('click', function(){

			var $this = $(this)

			// Validation

			if( $this.closest('[data-page=height]').length ){

				if( form.find('input[name=units]').val() == 'metric' && form.find('input[name=centimeters]').val() <= 90 ){
					alert( 'You must select your height!' )
					return
				}else if( form.find('input[name=units]').val() == 'imperial' && form.find('input[name=feet]').val() <= 0 ){
					alert( 'You must select your height!' )
					return
				}

			}else if( $this.closest('[data-page=weight]').length ){
				if( form.find('input[name=units]').val() == 'metric' && form.find('input[name=kilograms]').val() <= 0 ){
					alert( 'You must select your weight!' )
					return
				}else if( form.find('input[name=units]').val() == 'imperial' && form.find('input[name=weight]').val() <= 0 ){
					alert( 'You must select your weight!' )
					return
				}
			}

			nextPage($this)
		})

		// Changing Range Options

		function bindingRange(){
			var $this = $(this),
				bind = $this.data('bind'),
				value = $this.val()

			form.find('input[name=' + bind + ']').val( value )
			$('[data-show-value=' + bind + ']').html( value )
		}

		$('[data-bind]').on('change mousemove', bindingRange )

		// Clicking Back Button

		$('[data-back]').on( 'click', previousPage )
		$('[data-next]').on( 'click', function(){
			nextPage($('[data-next]'))
		} )

		$(window).on('load', function(){
			$('[data-bind]').each( bindingRange )
		})

		$(window).on('resize', function(){
			$('.pages').height( $('.page').eq(currnetPage).height() )
		})

	})
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/TweenMax.min.js", function() {
		   // alert("Script loaded but not necessarily executed.");
		});
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js", function() {
		   // alert("Script loaded but not necessarily executed.");
		});
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/utils/Draggable.min.js", function() {
		   // alert("Script loaded but not necessarily executed.");
		});

		$(".moving-area").mousemove(function(e) {
          parallaxIt(e, ".slide", -25);
          parallaxIt(e, ".moving-image", -6);
        });

        function parallaxIt(e, target, movement) {
          var $this = $(".moving-area");
          var relX = e.pageX - $this.offset().left;
          var relY = e.pageY - $this.offset().top;

          TweenMax.to(target, 1, {
            x: (relX - $this.width() / 2) / $this.width() * movement,
            y: (relY - $this.height() / 2) / $this.height() * movement
          });
        } 

})()