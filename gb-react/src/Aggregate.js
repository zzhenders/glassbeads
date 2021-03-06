import React from 'react';
import Post from './Post';
import { getPosts, updateBookmark, updateFollowing, getBookmarks,
		 getFollowing, getUsernames } from './Api';

class Aggregate extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	bookmarks: {},
	    	posts: {},
	    	users: {},
	    	following: {},
	    	isLoaded: false,
	    };
	    this.lookupUsernames = this.lookupUsernames.bind(this);
	    this.lookupBookmarks = this.lookupBookmarks.bind(this);
	    this.lookupFollowing = this.lookupFollowing.bind(this);
	    this.setBookmarker = this.setBookmarker.bind(this);
	    this.setFollowing = this.setFollowing.bind(this);
	    this.addBookmark = this.addBookmark.bind(this);
	    this.removeBookmark = this.removeBookmark.bind(this);
	    this.isBookmarked = this.isBookmarked.bind(this);
	}

  	setBookmarker = (uid, post_id) => {
		if (this.isBookmarked(post_id)) {
			updateBookmark(uid, post_id, 'delete')
			.then(() => this.removeBookmark(post_id));
		} else {
			updateBookmark(uid, post_id, 'create')
			.then(() => this.addBookmark(post_id));
		}
  	}

  	setFollowing = (uid, user_id, uname) => {
  		if (this.state.following.hasOwnProperty(user_id)) {
  			updateFollowing(uid, user_id, 'unfollow')
  			.then(() => this.removeFollowing(user_id));
  		} else {
  			updateFollowing(uid, user_id, 'follow')
  			.then(() => this.addFollowing(user_id, uname));
  		}
  	}


  	addBookmark(post_id) {
  		const newBookmarks = {
  			...this.state.bookmarks,
  			[post_id]: true
  		}
  		this.setState({bookmarks: newBookmarks});
  	}

  	removeBookmark(post_id) {
  		const newBookmarks = {
  			...this.state.bookmarks,
  			[post_id]: false
  		}
  		this.setState({bookmarks: newBookmarks});
  	}

  	addFollowing(user_id, uname) {
  		const newFollowing = {
  			...this.state.following,
  			[user_id]: uname
  		}
  		this.setState({following: newFollowing});
  	}

  	removeFollowing(user_id) {
  		let newFollowing = this.state.following;
  		delete newFollowing[user_id];

  		this.setState({following: newFollowing});
  	}

  	isBookmarked(post_id) {
  		return this.state.bookmarks[post_id];
  	}

	lookupBookmarks(arrayOfPostIds, uid) {
		getBookmarks(arrayOfPostIds, uid).then(data => {
			this.setState({bookmarks: data});
		})
	}

	lookupFollowing(uid) {
		getFollowing(uid).then(data => {
			this.setState({following: data});
		})
	}

	lookupUsernames(arrayOfUserIds) {
		getUsernames(arrayOfUserIds).then(data => {
			this.setState({users: data});
		})
	};

	loadAggregate() {
		getPosts(this.props.api)
		.then(data => {this.setState({posts: data})})
		.then(() => {
			let userIds = new Set();
			let postIds = new Set();

			Object.entries(this.state.posts).forEach(([key, post]) => {
				userIds.add(post.user_id);
				postIds.add(post.id);
			});

			userIds = Array.from(userIds);
			postIds = Array.from(postIds);

			if (userIds.length > 0 && postIds.length > 0) {
				this.lookupUsernames(userIds);
				this.lookupFollowing(this.props.uid);
				this.lookupBookmarks(postIds, this.props.uid);
			}
			this.setState({isLoaded: true});
		});
	}

	componentDidMount() {
		this.loadAggregate();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.api !== this.props.api) { 
			this.loadAggregate();
		}
	}

	render() {
		let posts = [];
		Object.entries(this.state.posts).forEach(([key, post]) => {
			posts.push(
				<Post
					uid={this.props.uid}
					key={key}
					post_id={post.id}
					title={post.title}
					content={post.content}
					user_id={post.user_id}
					users={this.state.users}
					following={this.state.following}
					setFollowing={this.setFollowing}
					bookmarker={this.setBookmarker}
					isBookmarked={this.isBookmarked}
					aggregateIsLoaded={this.state.isLoaded}
					setView={this.props.setView}
				/>
			);	
		});
		return (
			<div className="aggregate" id="main">
				<div className="view flex-flow-row-wrap">
					{posts}
				</div>
			</div>
		);
	}
}

export default Aggregate;
