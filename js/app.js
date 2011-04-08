$(document).ready(function(){
	$('#new').click(function(){
		location.hash = '/new/current';
	});

	$('#twitter').click(function(){
		location.hash = '/twitter/current';
	});

	$('#github').click(function(){
		location.hash = '/github/current';
	});

	window.app = Sammy(function() {
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
		this.get('#/new/current',function(){
			$.getJSON('http://www.noticiashacker.com/nuevo.json?callback=?',function(data){
				var now = new Date();
				$.tmpl('panel',{id:now.getTime(),title:'Nuevo'}).prependTo('#posts');
				_.each(data.posts, function(post,i){
					post.delta = 'new';
					post.comment_delta = 0;
					post.votes_delta = 0;					
					$.tmpl('post',post).appendTo('#'+now.getTime()+' .posts');
				})
				$('#'+now.getTime()).show();
			});
		});
		this.get('#/twitter/current',function(){
			$('.currentPanel').remove();
			var now = new Date();
			Wall.all().filter('from','=','twitter').filter('timestamp','>',now.getTime() - 3600000).order("timestamp", false).one(null, function(results){
				if(results){
					results.display();
				}else{
					$.getJSON('http://www.noticiashacker.com/api/usuarios/twitter?callback=?',function(data){
						var tw = new Wall({from:'twitter',timestamp:now.getTime(),data:data});
						persistence.add(tw);
						persistence.flush(function(){
							tw.display();
						});
					});
				}
			});
		});
		this.get('#/github/current',function(){
			$('.currentPanel').remove();
			var now = new Date();
			Wall.all().filter('from','=','github').filter('timestamp','>',now.getTime() - 3600000).order("timestamp", false).one(null, function(results){
				if(results){
					results.display();
				}else{
					$.getJSON('http://www.noticiashacker.com/api/usuarios/github?callback=?',function(data){
						var tw = new Wall({from:'github',timestamp:now.getTime(),data:data});
						persistence.add(tw);
						persistence.flush(function(){
							tw.display();
						});
/*						
						$.tmpl('panel',{id:'githubers',title:'githubers'}).prependTo('#posts');
						_.each(data.github_users,function(user){
							$.tmpl('user',{'user':user}).appendTo('#githubers .posts');
						})
						$('#githubers').show();
*/
					})						
				}
			});
		});
	});
});