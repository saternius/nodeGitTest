function DropDown(el) {
	this.dd = el;
	this.initEvents();
}
DropDown.prototype = {
	initEvents : function() {
		var obj = this;

		obj.dd.on('click', function(event){
			$(this).toggleClass('active');
			event.stopPropagation();
		});	
	}
}
$(function() {

	var dd = new DropDown( $('#dd') );
	var dd2 = new DropDown( $('#dd2') );
	var dd3 = new DropDown( $('#dd3') );
	var dd4 = new DropDown( $('#dd4') );

	$(document).click(function() {
					// all dropdowns
					$('.wrapper-dropdown-5').removeClass('active');
				});

});