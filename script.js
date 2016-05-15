//If you have any questions about what anything does just ask me.

$(document).ready(function(){
	//INITIALIZE
	i=0
	/*We will want to make 5 rows of 11 columns of space invaders, 
	so will iterate through everything that is in the while expression while 
	the variable i is < 11*5. Since after every iteration i is incremented by 1,
	after 11*5 iterations i will be greater or equal to 11*5, which will end the while
	loop and the the script will continue running.*/
	while (i<11*5) {
		i+=1
		/*The following adds (appends=add as the last element inside the selected item) 
		to the div with the id: #invaderFleet a div with the class: .invader to it.*/
		$("#invaderFleet").append("<div class='invader'></div>");
	}

	// We are going to set variables that we are going to be needing
	var score = 0
	var speed = 1
	var direction = "+"
	var canShoot = true
	var lastAliveInvaders = $(".invader").length

	//ENGINE
	$("#play").click(function(){
		//Hide the play button
		$(this).hide();
		//Make the space invader fleet & spaceship appear
		$("#invaderFleet").show();
		$("#spaceShip").show();

		//Set keypresses to do different things.
		$(document).keydown(function(event) {
		  //event.which return key code of key pressed.
		  //You can find the js key codes here: http://www.cambiaresearch.com/articles/15/javascript-key-codes
		  if (event.which == 32 || event.which == 38) { //32=key code for space, 38=arrow up
		  	if (canShoot) {
		  		misilePosition = parseInt( $("#spaceShip").css("left") ) + ($("#spaceShip").width()/2) - 5 //5=missile width/2
		  		$("body").append("<div id='missile' style='left: " + misilePosition + "px;'></div>");
		  		canShoot = false
		  		//set function to run on interval of 1 ms
		  		var missileShootInverval = setInterval(function(){
		  			//if missile is still on screen
		  			if (parseInt($("#missile").css("bottom")) < $(window).height()) {
		  				//if missile is located inside the fleet area (div)
		  				if ( $("#missile").position().top <= $("#invaderFleet").position().top+$("#invaderFleet").height() && 
		  					$("#missile").position().top >= $("#invaderFleet").position().top && 
		  					$("#missile").position().left >= $("#invaderFleet").position().left && 
		  					$("#missile").position().left <= $("#invaderFleet").position().left+$("#invaderFleet").width() ) {
		  					
		  					$(".invader").each(function(){
		  						//if missile comes in contact with a space invader
		  						if ( $("#missile").position().top <= $(this).position().top+$(this).height()+$("#invaderFleet").position().top && 
				  					$("#missile").position().top >= $(this).position().top+$("#invaderFleet").position().top && 
				  					$("#missile").position().left >= $(this).position().left+$("#invaderFleet").position().left && 
				  					$("#missile").position().left <= $(this).position().left+$(this).width()+$("#invaderFleet").position().left &&
				  					$(this).css("visibility") != "hidden" ) {

		  							//hide the invader touched by missile (this) and remove the missile from page
		  							$(this).css("visibility", "hidden");
		  							$("#missile").remove();
		  							//Clear the interval so the program stops itterating through the function
		  							clearInterval(missileShootInverval);
		  							//Set can shoot to true so that the player can shoot again
		  							canShoot = true;

		  						}
		  					});

		  				}
		  				$("#missile").css("bottom", "+=3")
		  			} else {
		  				//removes the missile from the page
		  				$("#missile").remove();
		  				//Clear the interval so the program stops itterating through the function
		  				clearInterval(missileShootInverval);
		  				//Set can shoot to true so that the player can shoot again
		  				canShoot = true;
		  			}
		  		}, 1)
		  	}
		  } else if (event.which == 37) { //left arrow
		  	//only if spaceShip is not at the left edge of the page
		  	if ( $("#spaceShip").position().left > $("#spaceShip").width() ) {
		  		$("#spaceShip").css("left", "-=10");
		  	}
		  } else if (event.which == 39) { //right arrow
		  	//only if spaceShip is not at the right edge of the page
		  	if ( $("#spaceShip").position().left < $(window).width()-$("#spaceShip").width() ) {
		  		$("#spaceShip").css("left", "+=10");
		  	}
		  }
		});

		//SetInterval(function, time) runs the function every x ms, in the case (1000/speed ms).
		function gameEngine(){
			var gameEngineInterval = setInterval(function(){ 
				//gets all non-dead invadors
				var aliveInvaders = $('.invader').filter(function() {
		    	return $(this).css("visibility") != 'hidden';
				});
				//if there are still invaders
				if(aliveInvaders.length > 0) {
					//if the invaders have reached the edge
					if ( ($(window).width()-$("#invaderFleet").width()-$("#invaderFleet").position().left ) >= 50 && $("#invaderFleet").position().left >= 50 ) {
						$("#invaderFleet").css("left", direction + "=25"); //Move invader by 25 pixels
					} else {
						//Move down
						$("#invaderFleet").css("top", "+=50");
						//Change direction
						if (direction == "-") {
							direction = "+"
						} else {
							direction = "-"
						}
						setTimeout($("#invaderFleet").css("left", direction + "=25"), 1000);
					}
					if ($('#invaderFleet').position().top+$('#invaderFleet').height() >= $(window).height() ){
						//Check that an invader in the fleet that is alive has reached the bottom
						aliveInvaders.each(function(){
							if ( $(this).position().top+$(this).height()+$('#invaderFleet').position().top >= $(window).height() ) {
								//stop the current running gameEngineInterval
								clearInterval(gameEngineInterval);
								//send to gameover page
								window.location.href = "/gameover";
							}
						});
					}
				} else {
					//game has ended
					clearInterval(gameEngineInterval);
					window.location.href = "/next_level";
				}
			//change invader speed based on how many are left
			if (aliveInvaders.length != lastAliveInvaders) {
				console.log("Change in invader count");
				speed = 1 + ($(".invader").length-aliveInvaders.length)*0.1
				console.log("New speed = " + speed);
				//stop the current running gameEngineInterval to restart it with the new speed
				clearInterval(gameEngineInterval);
				gameEngine();
			}
			lastAliveInvaders = aliveInvaders.length
			}, 1000/speed);
		}

		//Run the game engine
		gameEngine();

	});

});