$(document).ready(function(){
	//init varibles and compile templates
	var prev = false;
	var current = false;
	$("#panelTemplate").template("panel");
	$("#tabsTemplate").template("tabs");
	$("#postTemplate").template("post");
	
	$.getJSON('http://hack.org.mx/noticias-hacker/last.php?callback=?',function(data){
		window.current = data[_(data).chain().keys().max().value()];
		_.each(data,function(item,j){if(item){_.each(item.posts,function(post,i){post.pos = i + 1;});}});
		_.each(data,function(item,time){
			if(item){
				var timelabel = parseTime(time * 1000);
				$.tmpl('panel',{id:time*1000,title:timelabel}).prependTo('#posts');
				$.tmpl('tabs',{id:time*1000,label:timelabel}).prependTo('#tabs');
				
				_.each(item.posts,function(post,i){
					if(prev.key){
						post.last = _.detect( prev.item.posts ,function(old){
							return old.id == post.id; 
						});
						if(post.last){
							post.delta = post.last.pos - post.pos;
							post.votes_delta = post.votes - post.last.votes;
							post.comment_delta = post.comment_count - post.last.comment_count;
						}else{
							post.delta = 'new';
							post.comment_delta = 0;
							post.votes_delta = 0;
						}
					}else{
						post.delta = 0;
						post.comment_delta = 0;
						post.votes_delta = 0;					
					}
					$.tmpl('post',post).appendTo('#'+time*1000+' .posts');
				});
				prev = {key : timelabel,item : item};
			}
		});
		
		app.run('#/');
	});
	
	setInterval(function(){
		var now = new Date();
		if(now.getMinutes() == 0){
			$.getJSON('http://www.noticiashacker.com/.json?callback=?',function(data){
				var now = new Date();
				timelabel = parseTime(now);
				_.each(data.posts,function(post,i){post.pos = i + 1;})
				$.tmpl('tabs',{id:now.getTime(),label:timelabel}).prependTo('#tabs');
				$.tmpl('panel',{id:now.getTime(),title:timelabel}).prependTo('#posts');
				_.each(data.posts, function(post,i){
					post.last = _.detect( current.posts ,function(old){
						return old.id == post.id; 
					});		
					if(post.last){
						post.delta = post.last.pos - post.pos;
						post.votes_delta = post.votes - post.last.votes;
						post.comment_delta = post.comment_count - post.last.comment_count;
					}else{
						post.delta = 'new';
						post.comment_delta = 0;
						post.votes_delta = 0;
					}		
					$.tmpl('post',post).appendTo('#'+now.getTime()+' .posts');
				});
			});
		}
	},60000);
	
	var app = Sammy(function() {
		this.get('#/', function() {
			$( ".panel" ).first().show();
			$('#tabs a').first().addClass('current');
		});
		this.get('#/tabs/:tab', function() {
			$('.panel').hide();
			$('.current').removeClass('current');
			$('#'+this.params['tab']).show();
			$('#tab'+this.params['tab']).addClass('current')
		});
	});
})

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
	if(minutes < 9){
		return '0' + minutes;
	}else{
		return minutes;
	}
}