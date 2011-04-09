$(document).ready(function(){
	$('#homeNav').click(function(){location.hash = '/home/current';});
	$('#nuevoNav').click(function(){location.hash = '/new/current';});
	$('#twitterNav').click(function(){location.hash = '/twitter/current';});
	$('#githubNav').click(function(){location.hash = '/github/current';});

	window.app = Sammy(function() {
		this.get('#/', function() {
			alert('hi');
		});
		this.get('#/home/current', function(){
			$('.currentPanel').remove();
			$('.selected').removeClass('selected');
			Page.all().filter('from','=','home').order("timestamp", false).one(null,function(r){
				r.display();
			});
		});
		this.get('#/tabs/:tab', function(){
			$('.panel').hide();
			$('.current').removeClass('current');
			$('#'+this.params['tab']).show();
			$('#tab'+this.params['tab']).addClass('current')
		});
		this.get('#/new/current',function(){
			$('.currentPanel').remove();
			$('.selected').removeClass('selected');
			var now = new Date();
			Page.all().filter('from','=','nuevo').filter('timestamp','>',now.getTime() - 1200000).one(null, function(r) { 
				if(r){
					r.display();
				}else{
				$.getJSON('http://www.noticiashacker.com/nuevo.json?callback=?',function(data){				
					var nuevo = new Page({timestamp:now.getTime(),from:'nuevo'});
					persistence.add(nuevo);
					_.each(data.posts, function(post,i){
						var post = new Post({title:post.title,timestamp:now.getTime(),from:'nuevo',data:post});	
						post.page(nuevo);
						persistence.add(post);
					});
					persistence.flush(function(){
						nuevo.display()
					});
				});
				}
			});
		});
		this.get('#/twitter/current',function(){
			$('.currentPanel').remove();
			$('.selected').removeClass('selected');
			var now = new Date();
			Twitter.all().filter('timestamp','>',now.getTime() - 3600000).order("timestamp", false).one(null, function(results){
				if(results){
					results.display();
				}else{
					$.getJSON('http://www.noticiashacker.com/api/usuarios/twitter?callback=?',function(data){
						var tw = new Twitter({timestamp:now.getTime(),data:data});
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
			$('.selected').removeClass('selected');
			var now = new Date();
			Github.all().filter('timestamp','>',now.getTime() - 3600000).order("timestamp", false).one(null, function(results){
				if(results){
					results.display();
				}else{
					$.getJSON('http://www.noticiashacker.com/api/usuarios/github?callback=?',function(data){
						var gh = new Github({timestamp:now.getTime(),data:data});
						persistence.add(gh);
						persistence.flush(function(){
							gh.display();
						});
					})						
				}
			});
		});
		this.get('#/historic/home/:timestamp',function(){
			Page.all().filter('from','=','home').filter('timestamp','=',this.params['timestamp']).one(null,function(r){
				r.display();
			})
		});
		this.get('#/historic/nuevo/:timestamp',function(){
			Page.all().filter('from','=','nuevo').filter('timestamp','=',this.params['timestamp']).one(null,function(r){
				r.display();
			})
		});
		this.get('#/historic/twitter/:timestamp',function(){
			Twitter.all().filter('timestamp','=',this.params['timestamp']).one(null,function(r){
				r.display();
			})
		});
		this.get('#/historic/github/:timestamp',function(){
			Github.all().filter('timestamp','=',this.params['timestamp']).one(null,function(r){
				r.display();
			})
		})
	});
});