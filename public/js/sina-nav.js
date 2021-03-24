/**
 * Template name: Sina-nav Multi Purpose Menu
 * Template URI: https://github.com/shaonsina/sina-nav-4
 * Version: 2.2
 * Author: shaonsina
 */

(function ($) {
	'use strict';
	$.fn.sinaNav = function () {
		return this.each( function() {
			var getNav		= $(this),
				top 		= getNav.data('top') || getNav.offset().top,
				mdTop 		= getNav.data('md-top') || getNav.offset().top,
				xlTop 		= getNav.data('xl-top') || getNav.offset().top,
				navigation 	= getNav.find('.sina-menu'),
				getWindow 	= $(window).outerWidth(),
				anim 		= getNav.data('animate-prefix') || '',
				getIn 		= navigation.data('in'),
				getOut 		= navigation.data('out');

				$(window).on('resize', function(){
					getWindow 	= $(window).outerWidth();
				});


			// Widget-bar
			// ---------------------------------
			getNav.find('.extension-nav').each(function(){
				$('.widget-bar-btn > a', this).on('click', function(e){
					e.preventDefault();
					getNav.children('.sina-nav-overlay').fadeIn(400);
					getNav.children('.widget-bar').toggleClass('on');
				});
			});
			getNav.find('.widget-bar .close-widget-bar').on('click', function(e){
				e.preventDefault();
				getNav.children('.widget-bar').removeClass('on');
				getNav.children('.sina-nav-overlay').fadeOut(600);
			});
			getNav.children('.sina-nav-overlay').on('click', function() {
				getNav.children('.widget-bar').removeClass('on');
				$(this).fadeOut(600);
			});

			// Toggle Button
			getNav.find('.navbar-toggle').on('click', function(){
				$('.fa', this).toggleClass('fa-bars').toggleClass('fa-times');
			});


			// Eevent
			// -------------------------------------
			getNav.find('.sina-menu, .extension-nav').each(function(){
				var menu = this;

				$('.dropdown-toggle', menu).on('click', function (e) {
					e.stopPropagation();
					return false;
				});

				$('.dropdown-menu', menu).addClass(anim+'animated');
				$('.dropdown', menu).on('mouseenter', function(){
					var dropdown = this;

					$('.dropdown-menu', dropdown).eq(0).removeClass(getOut).stop().fadeIn().addClass(getIn);
					$(dropdown).addClass('on');
				});
				$('.dropdown', menu).on('mouseleave', function(){
					var dropdown = this;

					$('.dropdown-menu', dropdown).eq(0).removeClass(getIn).stop().fadeOut().addClass(getOut);
					$(dropdown).removeClass('on');
				});

				$('.dropdown', menu).on('focusin', function(){
					var dropdown = this;

					$('.dropdown-menu', dropdown).eq(0).removeClass(getOut).stop().fadeIn().addClass(getIn);
					$(dropdown).addClass('on');
				});
				$('.dropdown', menu).on('focusout', function(){
					var dropdown = this;

					$('.dropdown-menu', dropdown).eq(0).removeClass(getIn).stop().fadeOut().addClass(getOut);
					$(dropdown).removeClass('on');
				});
				$('.mega-menu-col', menu).children('.sub-menu').removeClass('dropdown-menu '+anim+'animated');
			});

			if( getWindow < 1025 ) {
				// Megamenu
				getNav.find('.menu-item-has-mega-menu').each(function(){
					var megamenu 	= this,
						$columnMenus = [];

					$('.mega-menu-col', megamenu).children('.sub-menu').addClass('dropdown-menu '+anim+'animated');
					$('.mega-menu-col', megamenu).each(function(){
						var megamenuColumn = this;

						$('.mega-menu-col-title', megamenuColumn).on('mouseenter', function(){
							var title = this;

							$(title).closest('.mega-menu-col').addClass('on');
							$(title).siblings('.sub-menu').stop().fadeIn().addClass(getIn);
						});

						if( !$(megamenuColumn).children().is('.mega-menu-col-title') ) {
							$columnMenus.push( $(megamenuColumn).children('.sub-menu') );
						}
					});

					$(megamenu).on('mouseenter', function(){
						var submenu;
						for (submenu in $columnMenus) {
							$columnMenus[ submenu ].stop().fadeIn().addClass(getIn);
						}	
					});

					$(megamenu).on('mouseleave', function() {
						$('.dropdown-menu', megamenu).stop().fadeOut().removeClass(getIn);
						$('.mega-menu-col', megamenu).removeClass('on');
					});
				});
			}
		});
	}
	// Initialize
	$('.sina-nav').sinaNav();
}(jQuery));