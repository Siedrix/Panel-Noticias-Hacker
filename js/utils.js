function renderSidebar(type){
	$('#tabs').html('');
	if(type == "new"){
		Page.all().filter('from','=','nuevo').list(null,function(r){
			_.each(r,function(r){
				var time = strToDate(r.timestamp());	
				var timelabel = parseTime(time);
				$.tmpl('tabs',{id:time,type:type,label:timelabel}).prependTo('#tabs');
			});
		})
	}else if(type == "twitter"){
		Twitter.all().list(null,function(r){
			_.each(r,function(r){
				var time = strToDate(r.timestamp());	
				var timelabel = parseTime(time);
				$.tmpl('tabs',{id:time,type:type,label:timelabel}).prependTo('#tabs');
			});
		})
	}else if(type == "github"){
		Github.all().list(null,function(r){
			_.each(r,function(r){
				var time = strToDate(r.timestamp());	
				var timelabel = parseTime(time);
				$.tmpl('tabs',{id:time,type:type,label:timelabel}).prependTo('#tabs');
			});
		})		
	}
}

function strToDate(str){
	var time = new Date();
	return time.setTime(str);
}

function parseTime(time){
	var date = new Date(time);
	var hr = date.getHours();
	if(hr > 11){
		return date.getHours() - 12 +':'+parseMinutes(date.getMinutes())+'pm';
	}else{
		return date.getHours()+':'+parseMinutes(date.getMinutes())+'am';
	}
}

function parseMinutes(minutes){
	if(minutes <= 9){
		return '0' + minutes;
	}else{
		return minutes;
	}
}