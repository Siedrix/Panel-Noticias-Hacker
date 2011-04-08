$(document).ready(function(){
	if (window.openDatabase) {
		persistence.store.websql.config(persistence, "nh", 'database', 5 * 1024 * 1024);
	}else{
		persistence.store.memory.config(persistence);
	}	

	//Post Model
	window.Post = persistence.define('Post', {
		title:'TEXT',
		from:'TEXT',
		timestamp:'TEXT',
		data:'JSON'
	});
	Post.prototype.toJson = function(){
		return {
			id:this.id,
			title:this.title,
			url:this.data().url,
			user:this.data().user,
			votes:this.data().votes,
			comment_count:this.data().comment_count,
			delta:'new',
			votes_delta:0,
			comment_delta:0
		}
	}
	
	//Pages Model
	window.Page = persistence.define('Page', {
		from:'TEXT',
		timestamp:'TEXT',
	});
	Page.hasMany('posts', Post, 'page');
	
	Page.prototype.display = function(){
		$.tmpl('panel',{id:'new',title:'Nuevo'}).prependTo('#posts');
		this.posts().list(null,function(r){
			_.each(r,function(post){
				$.tmpl('post',post.toJson()).appendTo('#new .posts');
			})
		});
		$('#new').show().addClass('currentPanel');			
		$('#newNav').addClass('selected');		
		renderSidebar('pages');
	}

	
	//Twitter Model
	window.Twitter = persistence.define('Twitter', {
		timestamp: "TEXT",
		data: "JSON"
	});
	
	Twitter.prototype.display = function(){
		$.tmpl('panel',{id:'twitters',title:'twitters'}).prependTo('#posts');
		_.each(this.data().twitter_users,function(user){
			$.tmpl('user',{'user':user}).appendTo('#twitters .posts');
		});
		$('#twitters').show().addClass('currentPanel');			
		$('#twitterNav').addClass('selected');
		renderSidebar('twitter');
	}
	
	//Github Model
	window.Github = persistence.define('Github', {
		timestamp: "TEXT",
		data: "JSON"
	});	
	
	Github.prototype.display = function(){
		$.tmpl('panel',{id:'github',title:'githubers'}).prependTo('#posts');
		_.each(this.data().github_users,function(user){
			$.tmpl('user',{'user':user}).appendTo('#github .posts');
		});
		$('#github').show().addClass('currentPanel');				
		$('#githubNav').addClass('selected');
		renderSidebar('github');
	}
	
	persistence.schemaSync(function(){
		window.app.run('#/');
	});
	
});