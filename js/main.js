$(document).ready(function(){
	//init varibles and compile templates
	var prev = false
	$("#panelTemplate").template("panel");
	$("#tabsTemplate").template("tabs");
	$("#postTemplate").template("post");
	
	$.getJSON('http://hack.org.mx/noticias-hacker/last.php?callback=?',function(data){
		_.each(data,function(item,j){if(item){_.each(item.posts,function(post,i){post.pos = i + 1;});}});
		_.each(data,function(item,time){
			if(item){
				var timelabel = parseTime(time);
				$.tmpl('panel',{title:timelabel}).prependTo('#posts');
				$.tmpl('tabs',{title:timelabel}).prependTo('#tabs');
				
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
					$.tmpl('post',post).appendTo('#'+timelabel+' .posts');
				});
				prev = {key : timelabel,item : item};
			}
		});
		
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
		})
		
		app.run('#/');
	});
})

function parseTime(time){
	var date = new Date(time * 1000);
	var hr = date.getHours();
	if(hr > 11){
		return date.getHours() - 12 +'pm';
	}else{
		return date.getHours()+'am';
	}
}