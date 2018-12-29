var row_counter = 0;
var row_position = 0;
var column_position = 0;

var attack_timer;

var attacked_timer = {};
var player_health = 100;

var attack_flag = true;

//difficulty balancing
var health_lower_limit = 30;
var health_upper_limit = 90;

var spawn_frequency = 2400;
var spawn_timer;

//stats
var killcount = 0;
var endflag = false;

var ost = new Audio();
ost.src = "sounds/ost.mp3";

var failure = new Audio();
failure.src = "sounds/failure.mp3";
var failure2 = new Audio();
failure2.src = "sounds/failure2.mp3";


var damage1 = new Audio();
damage1.src = "sounds/damage1.mp3";
var damage2 = new Audio();
damage2.src = "sounds/damage2.mp3";
var damage3 = new Audio();
damage3.src = "sounds/damage3.mp3";


var collector =  {};
collector[0] = new Audio();
collector[1] = new Audio();
collector[2] = new Audio();
collector[3] = new Audio();
collector[4] = new Audio();
collector[0].src = "sounds/collector0.mp3";
collector[1].src = "sounds/collector1.mp3";
collector[2].src = "sounds/collector2.mp3";
collector[3].src = "sounds/collector3.mp3";
collector[4].src = "sounds/collector4.mp3";

var collector_death =  {};
collector_death[0] = new Audio();
collector_death[1] = new Audio();
collector_death[2] = new Audio();
collector_death[0].src = "sounds/collector_death0.mp3";
collector_death[1].src = "sounds/collector_death1.mp3";
collector_death[2].src = "sounds/collector_death2.mp3";

var equipped = 1; //1 is cannon, 2 is laser


$(document).ready( function () {

	var window_height = $(document).height();

	var weapon_sounds = {};
	weapon_sounds['laser'] = new Audio();
	weapon_sounds['laser'].src = "sounds/laser.mp3";
	/*weapon_sounds['cannon'] = new Audio();
	weapon_sounds['cannon'].src = "sounds/cannon.mp3"; */

	var weapon_damage =  {};
	weapon_damage['laser'] = 3;
	weapon_damage['cannon'] = 30;




	for(var i = 0; i<10; i++)
	draw_row("box-default", "box-default", "box-default", "box-default");

	$(".box-default").css("height", (1/10*window_height)+"px");

	/*
	$(".timer").css("height", (5/10*window_height)+"px");
	var timer_height = $(".timer").css("height");
	$(".timer").css("width", timer_height);
	*/

	
	$('.startgame-modal').modal({
    backdrop: 'static',
    keyboard: false
	});
	$(".startgame-button").click(function () {

		initialise_player(player_health);

		spawn_timer = setInterval(function () {

			var ran_col = 0;
		var ran_row = 0;

		
		var health = 0;
				ran_row = Math.floor( Math.random() * 10);
				ran_col = Math.floor( Math.random() * 12);
				if (document.getElementsByClassName(('enemy'+ran_row+''+ran_col)).length == 0)
				{
					health = Math.floor((Math.random() * health_upper_limit) + health_lower_limit);
					spawn_enemy(ran_row,ran_col,health,20, 10);
				}
				
		}, spawn_frequency);
		
	});
	

	$(window).keydown(function(e) {
       if(e.which == 37) // left arrow
       {
       		if(column_position > 0)
       		{
       			$("#" + row_position+column_position).removeClass("active");
       			column_position--;
       			$("#" + row_position+column_position).addClass("active");
       			
       		}
       }
       if(e.which == 38) // up arrow
       {
       		if(row_position > 0)
       		{
       			$("#" + row_position+column_position).removeClass("active");
       			row_position--;
       			$("#" + row_position+column_position).addClass("active");
       		}
       }
       if(e.which == 39) // right arrow
       {
       		if(column_position < 11)
       		{
       			$("#" + row_position+column_position).removeClass("active");
       			column_position++;
       			$("#" + row_position+column_position).addClass("active");
       		}
       }
       if(e.which == 40) // down arrow
       {
       		if(row_position < row_counter-1)
       		{
       			$("#" + row_position+column_position).removeClass("active");
       			row_position++;
       			$("#" + row_position+column_position).addClass("active");
       		}
       }

       if(e.which == 49) // 1
       {
       		equipped = 1;
       }

       if(e.which == 50) // 2
       {
       		equipped = 2;
       }

       if(e.which == 32) //spacebar
       {
       		e.preventDefault();
       		if(equipped == 1)
			{
				if(attack_flag == true)
				{
					$("#" + row_position+column_position).addClass('firing-cannon');
					setTimeout(function () {
						$("#" + row_position+column_position).removeClass('firing-cannon');
					}, 100);


					var can = new Audio();
					can.src="sounds/cannon.mp3";
					can.play();
	       			attack(weapon_damage['cannon']);
	       			attack_flag = false;
       			}


			}
       		if(equipped == 2)
       		{
       			$("#" + row_position+column_position).addClass("firing-laser");

	       		var attack_timer = setInterval(attack(weapon_damage['laser']), 10);
	       		weapon_sounds['laser'].play();
	       	}
       }

       if(row_position > 5)
       {   
	       var new_id = (row_position-5)+""+column_position;
	       var y = document.getElementById(new_id);
	       y.scrollIntoView();
	   }

	});

	$(window).keyup(function(e) {
       if(e.which == 32) // spacebar
       {
       		if(equipped == 2)
       		{
       			clearInterval(attack_timer);
       			weapon_sounds['laser'].pause();
       			weapon_sounds['laser'].currentTime = 0;

       			$("#" + row_position+column_position).removeClass("firing-laser");
       		}
       		attack_flag = true;
       	}
	});

});





function draw_row(class_name1, class_name2, class_name3, class_name4)
{
	var row_html =  '<div class="row box-row">' +
			'<div id="' + row_counter + '0' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '1' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '2' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '3' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '4' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '5' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '6' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '7' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '8' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '9' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '10' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>' +
			'<div id="' + row_counter + '11' + '" class="col-md-1 col-sm-1 col-lg-1 col-xs-1 ' +class_name1+'  ">' +
			'</div>';

	$(".drawing-area").before(row_html);
	row_counter++;
}

function initialise_player(health)
{
	$("#" + row_position+column_position).addClass("active");
	ost.play();

	healthbar_html = '<div class="progress healthbar-progress">' +
							'<div class="the_healthbar progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+health+'"  aria-valuemin="0" aria-valuemax="'+health+'" style="width:100%">'+
							  '</div>'+
							'</div>';

	$(".healthbar-parent").append(healthbar_html);
}





function spawn_enemy(row_number, column_number, health, armour, damage)
{
	var enemy_html = '<div class="healthbar-enemy-parent healthbar-enemy-parent'+row_number+''+column_number+'">' +
						'<div class="progress healthbar-enemy-progress">' +
							'<div class="enemy'+row_number+column_number+' healthbar-enemy progress-bar progress-bar-danger" role="progressbar" aria-valuenow="'+health+'" aria-valuemin="0" aria-valuemax="'+health+'">'+
							  '</div>' +
							'</div>'+
						'</div>'+

						'<img src="images/collector.png" class="collector-img img-responsive img'+row_number+''+column_number+'"></img>'+

						'<div class="clock'+row_number+''+column_number+' meter">' +
						    '<div class="timer-inner"></div>'+
						'</div>';

	$("#" + row_number+column_number).append(enemy_html);

	var x = Math.floor(Math.random() * 5);
	collector[x].play();


	attacked_timer[row_number+''+column_number] = setInterval(function() {

		var max_health = parseInt( $(".the_healthbar").attr("aria-valuemax") );
		player_health-=damage;


		$(".the_healthbar").css("width", ( (player_health/max_health)*100)+"%");

		if(player_health >= 70)
		{
			damage1.play();
		}

		else if(player_health >= 40 && player_health <70)
		{
			damage2.play();
		}

		else if(player_health >0 && player_health < 40)
		{
			damage3.play();
		}
		if(player_health <= 0)
		{
			ost.pause();
       		ost.currentTime = 0;
			$('.endgame-modal').modal({
    			backdrop: 'static',
    			keyboard: false
			});
			failure.play();

			if(endflag == false)
			{
					failure2.play();
					endflag = true;
					var endgame_html = "<p>The collectors have defeated you.</p>"+
							   "<p> Collectors killed : " + killcount + "</p>";

			$(".endgame-modal-body").append(endgame_html);
			}

			for(var key in attacked_timer)
			{
				clearInterval(key);
			}



			clearInterval(spawn_timer);

			return;
		}
	}, 10000);
}



function attack(damage_dealt)
{
	var max_health = parseInt ($(".enemy"+row_position+''+column_position).attr("aria-valuemax") );
	var current_health = parseInt( $(".enemy"+row_position+''+column_position).attr("aria-valuenow") );
	current_health-=damage_dealt;

	console.log((current_health/max_health)*100+"%");
	$(".enemy"+row_position+column_position).css("width", ( (current_health/max_health)*100)+"%");
	setTimeout(function() {},1000);
	if(current_health <= 0)
	{
		//making it harder here
		killcount++;
		if(killcount %2 == 0)
		{
			health_lower_limit += 10;
		}
		if(killcount%3 == 0)
		{
			health_upper_limit += 20;
		}
		if(killcount %5 == 0)
		{
			spawn_frequency -= 200;
		}

		var ran_sound = Math.floor(Math.random() *3);
		collector_death[ran_sound].play();

		$(".healthbar-enemy-parent"+row_position+''+column_position).hide();
		$(".healthbar-enemy-parent"+row_position+''+column_position).removeClass('healthbar-enemy-parent'+row_position+column_position);
		$(".enemy"+row_position+column_position).removeClass("enemy"+row_position+column_position);

		$(".clock"+row_position+column_position).hide();
		$(".clock"+row_position+column_position).removeClass(".clock"+row_position+column_position);

		$(".img"+row_position+column_position).hide();
		$(".img"+row_position+column_position).removeClass(".img"+row_position+column_position);

		clearInterval(attacked_timer[row_position+''+column_position]);
		return;
	}

	$(".enemy"+row_position+column_position).attr("aria-valuenow", current_health);
}

function magic()
{
	location.reload();
}

/* //UNUSED:
var x = document.getElementsByClassName("active");
	       
	       var row_no = parseInt( (x[0].id).substring(0,(x[0].id.length-1)) );
	       var col_no = parseInt( (x[0].id).substring((x[0].id.length)-1, (x[0].id.length)) );

	       //console.log(row_no + " " + col_no);

*/