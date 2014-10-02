var network = true;

$( document ).ready(function() {
	new FastClick(document.body);
	iframeLoad($('#itable'));
	$("#bFecha").toggleClass("tabsel");
	jugLoad();
	setInterval(jugLoad, 5000);
	var delJugadores = [];

	if(network) {
		$("#itable").attr('src', 'http://www.datafutbol.net/comunidad/campeonato/tablas/545#tabla-posiciones-1692');
		$("#iwfecha").attr('src','http://www.360sports.com.ar/images/horarios_domingos.jpg');
	} else {
		alert("no hay internesss, no hay data")
		$("#itable").hide();
		$("#iwfecha").hide();
		$("#tablaweb").append("<span class='wtext'>Error. Estas conectado a internet boludo?</span>");
		$("#fechaweb").append("<span class='wtext'>Error. Estas conectado a internet boludo?</span>");
	}

	$("#bFecha").click(function () {
		$(".tab").removeClass("tabsel");
		$(this).toggleClass("tabsel");
		tabs("fecha");
	});
	$("#bTabla").click(function () {
		$(".tab").removeClass("tabsel");
		$(this).toggleClass("tabsel");
		tabs("tabla");
	});
	$("#bJug").click(function () {
		$(".tab").removeClass("tabsel");
		$(this).toggleClass("tabsel");
		tabs("jug");	
	});
	$("#rtabla").click(function(){
		if(network) {
			animate($(this), "rotate");
			$("#itable").attr('src', 'http://www.datafutbol.net/comunidad/campeonato/tablas/545#tabla-posiciones-1692');
			iframeLoad($('#itable'));
			$('#tablaweb').effect("fade");
			$("#itable").show();
			$("#tablaweb span").remove();
			setTimeout(function() {$( "#tablaweb" ).fadeIn();}, 350 );
		} else {
			alert("no hay interne amigo");
		}	
	});
	$("#rfecha").click(function(){
		if(network) {
			$('#fechaweb').effect("fade");
			animate($(this), "rotate");
			$('#iwfecha').attr("src","http://360sports.com.ar/images/horarios_domingos.jpg");
			$("#iwfecha").show();
			$("#fechaweb span").remove();
			setTimeout(function() {$( "#fechaweb" ).fadeIn();}, 350 );
		} else {
			alert("no hay interne amigo");
		}
	});
	$("#rjug").click(function(){
		if(network) {	
			animate($(this), "rotate");
			$('#ljug span').effect("fade");
			setTimeout(function() { 
				$('#ljug span').remove();
				$('#ljug br').remove();
			}, 150);
			setTimeout(jugLoad, 350);
		} else {
			alert("no hay interne amigo");
		}
	});
	$("#iwfecha").click(function() { $('#imgModal').modal('toggle'); })
	$("#addbtn").click(function(){
		if(!isNullOrWhiteSpace($("#nInv").val()) && (($("#nInv").val().length<30) && ($("#nInv").val().length>2))) {
			dbrequest("http://stingo.com.ar:9290/user/"+$("#nInv").val(), "POST");
			$("#rjug").click();
			$("#nInv").val("");
		} else {
			animate($("#nInv"), "invalidtxt");
		}
	});
	$("#edit").click(function() {
		$('#ljug .check').not('.glyphicon-remove').removeClass('glyphicon-ok');
		$('#ljug .check').not('.glyphicon-remove').addClass('glyphicon-remove');
		$('#ljug .glyphicon-remove').addClass('bounce');
		$('#ljug .glyphicon-remove').addClass('del');

	});
	$("#ljug").on('click', '.del', function () {
		//dbrequest("http://stingo.com.ar:9290/user/"+$(this).closest('.name').text(),"DELETE");
		console.log($(this).closest('.name').text())
		$(this).closest('.name').remove();
	});
	$("#ljug").on('click', '.check', function () {
		if($(this).hasClass("glyphicon-remove")) {
			dbrequest("http://stingo.com.ar:9290/check/"+$(this).closest('.name').text()+"/true","POST")
		} else if ($(this).hasClass("glyphicon-ok")){
			dbrequest("http://stingo.com.ar:9290/check/"+$(this).closest('.name').text()+"/false","POST")
		}
		jugLoad();
	});

	$("#preload").hide();
});

function tabs(id) {
	switch(id) {
		case "fecha":
			$("#fecha").show()
			$("#tabla").hide()
			$("#jug").hide()
			break;
		case "tabla":
			$("#tabla").show()
			$("#fecha").hide()
			$("#jug").hide()
			break;
		case "jug":
			$("#jug").show()
			$("#tabla").hide()
			$("#fecha").hide()
			break;
	}
}


var animate = function(animar, animation) {
    animar.addClass( animation );
    window.setTimeout(function() {
    	animar.removeClass( animation );
    	}
    , 1000 );  
}

function isNullOrWhiteSpace( input ) {
    if (input == null) return true;
    return input.replace(/\s/g, '').length < 1;
}

function jugLoad() {
	var request = $.get( "http://stingo.com.ar:9290/getJugadores");
	request.success(function(data) {
		network = true;
		$("#ljug").html("");
  		for (i=0;i<data.length;i++) {
 			if (!data[i].Checked) {
 				$("#ljug").append("<span class='wtext name'>"+data[i].Nombre + "<span class='wtext glyphicon glyphicon-remove check'></span><br></span>");
			} else {
				$("#ljug").append("<span class='wtext name'>"+data[i].Nombre + "<span class='wtext glyphicon glyphicon-ok check'></span><br></span>");
			}
		}
	});
	request.error(function(xhr, status, error) {
		network = false;
		 $("#ljug").html("");
	     $("#ljug").append("<span class='wtext'>Error. Estas conectado a internet boludo?</span>  "+ error);
	});	
}

function iframeLoad(iframe) {
	iframe.load(function(){
		iframe.contents().find(".bottom-line, #tab-tabla-1692, #tab-fairplay, #tab-vallamenosvencida, #tabla-posiciones-1692 .col3, .col4, .col5, .col6, .col7, .col9, .col-fp, .instructions").hide();
		iframe.contents().find('.titles').css("background-color", "#000069");
		iframe.contents().find('.titles').css("width", "100%");
		iframe.contents().find('.col1').css("width", "40%");		
		iframe.contents().find('.col2, .col8, .col10').css("width", "20%");
		iframe.contents().find(".col").closest("a").remove();
	})
}

function dbrequest (_url, _type) {
	jQuery.ajax( {
		url: _url, 
		type: _type
	})
}