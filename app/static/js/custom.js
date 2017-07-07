$(function(){

	$("#video__play").click(function(){
		var dataYoutube = $(this).parents('.js-video').attr('data-youtube');
		$(this).parents('.js-video').html('<iframe src="https://www.youtube.com/embed/'+ dataYoutube +'?autoplay=1" frameborder="0" allowfullscreen></iframe>')
	});
	

});

$(document).ready(function(){
	var owl = $('#carousel');
	owl.owlCarousel({
		items:5,
		loop:true,
		margin:0,
		// autoplay:true,
		// autoplayTimeout:5000,
		autoplayHoverPause:true,
		pagination: true,
		nav: true,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:3
			},
			1000:{
				items:5
			}
		}
	});
	$('.play').on('click',function(){
		owl.trigger('play.owl.autoplay',[1000])
	})
	$('.stop').on('click',function(){
		owl.trigger('stop.owl.autoplay')
	})
});






