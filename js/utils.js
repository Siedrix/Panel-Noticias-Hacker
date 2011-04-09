function syncHome(callback){
	Page.all().filter('from','=','home').order("timestamp", false).one(null,function(r){
		if(r){
			console.log('items on db');
			var now = new Date();
			var hr = Math.floor((now.getTime() - r.timestamp())/3600000);
			$.getJSON('http://hack.org.mx/noticias-hacker/last.php?limit='+hr+'&callback=?',function(data){
				_.each(data,function(item,time){
					if(time * 1000 > r.timestamp()){
						var home = new Page({timestamp:time*1000,from:'home'});
						persistence.add(home);
						_.each(item.posts, function(post,i){
							var post = new Post({title:post.title,timestamp:time*1000,from:'home',data:post});	
							post.page(home);
							persistence.add(post);				
						});
					}
					persistence.flush(function(){
						callback();
					});
				});
			});
		}else{
			console.log('brand new db');
			$.getJSON('http://hack.org.mx/noticias-hacker/last.php?callback=?',function(data){
				console.log(data);
				_.each(data,function(item,time){
					var home = new Page({timestamp:time*1000,from:'home'});
					persistence.add(home);
					_.each(item.posts, function(post,i){
						var post = new Post({title:post.title,timestamp:time*1000,from:'home',data:post});
						post.page(home);
						persistence.add(post);				
					});
				});
				persistence.flush(function(){
					callback();
				});
			});		
		}
	});
}

function renderSidebar(type,focus){
	$('#tabs').html('');
	if(type == "nuevo"){
		Page.all().filter('from','=','nuevo').list(null,function(r){
			_.each(r,function(r){
				var time = strToDate(r.timestamp());	
				var timelabel = parseTime(time);
				$.tmpl('tabs',{id:time,type:type,label:timelabel}).prependTo('#tabs');
				$('#tab'+focus).addClass('current');
			});
		})
	}else if(type == "home"){
		Page.all().filter('from','=','home').list(null,function(r){
			_.each(r,function(r){
				var time = strToDate(r.timestamp());	
				var timelabel = parseTime(time);
				$.tmpl('tabs',{id:time,type:type,label:timelabel}).prependTo('#tabs');
				$('#tab'+focus).addClass('current');
			});
		})
	}else if(type == "twitter"){
		Twitter.all().list(null,function(r){
			_.each(r,function(r){
				var time = strToDate(r.timestamp());	
				var timelabel = parseTime(time);
				$.tmpl('tabs',{id:time,type:type,label:timelabel}).prependTo('#tabs');
				$('#tab'+focus).addClass('current');
			});
		})
	}else if(type == "github"){
		Github.all().list(null,function(r){
			_.each(r,function(r){
				var time = strToDate(r.timestamp());	
				var timelabel = parseTime(time);
				$.tmpl('tabs',{id:time,type:type,label:timelabel}).prependTo('#tabs');
				$('#tab'+focus).addClass('current');
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