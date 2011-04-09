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
		timestamp:'INT',
	});
	Page.hasMany('posts', Post, 'page');
	
	Page.prototype.display = function(){
		type = this.from();
		console.log(type);
		$.tmpl('panel',{id:this.from(),title:'Nuevo'}).prependTo('#posts');
		this.posts().list(null,function(r){
			_.each(r,function(post){
				$.tmpl('post',post.toJson()).appendTo('#'+type+' .posts');
			})
		});
		$('#'+this.from()).show().addClass('currentPanel');			
		$('#'+this.from()+'Nav').addClass('selected');		
		renderSidebar(this.from(),this.timestamp());
	}

	
	//Twitter Model
	window.Twitter = persistence.define('Twitter', {
		timestamp: "INT",
		data: "JSON"
	});
	
	Twitter.prototype.display = function(){
		$.tmpl('panel',{id:'twitters',title:'twitters'}).prependTo('#posts');
		_.each(this.data().twitter_users,function(user){
			$.tmpl('user',{'user':user}).appendTo('#twitters .posts');
		});
		$('#twitters').show().addClass('currentPanel');
		$('#twitterNav').addClass('selected');
		renderSidebar('twitter',this.timestamp());
	}
	
	//Github Model
	window.Github = persistence.define('Github', {
		timestamp: "INT",
		data: "JSON"
	});	
	
	Github.prototype.display = function(){
		$.tmpl('panel',{id:'github',title:'githubers'}).prependTo('#posts');
		_.each(this.data().github_users,function(user){
			$.tmpl('user',{'user':user}).appendTo('#github .posts');
		});
		$('#github').show().addClass('currentPanel');				
		$('#githubNav').addClass('selected');
		renderSidebar('github',this.timestamp());
	}
	
	persistence.schemaSync(function(){
		syncHome(function(){
			window.app.run('#/');
		});
	});
	
});