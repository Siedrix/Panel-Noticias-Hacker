$(document).ready(function(){
	$('#new').click(function(){
		location.hash = '/new/current';
	});

	$('#twitter').click(function(){
		location.hash = '/twitter/current';
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
			$.getJSON('http://www.noticiashacker.com/api/usuarios/twitter?callback=?',function(data){
				$.tmpl('panel',{id:'users',title:'users'}).prependTo('#posts');
				_.each(data.twitter_users,function(user){
					$.tmpl('user',{'user':user}).appendTo('#users .posts');
				})
				$('#users').show();
			})
			console.log('hi')
		})
	});
});