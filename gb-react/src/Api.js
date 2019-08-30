let apiBase = 'http://localhost:5000'
if (process.env.NODE_ENV === 'production') {
	apiBase = '';
}

export function getPosts(api) {
	const uri = `${apiBase}${api}`
	return fetch(uri, {
	}).then(response => {
		return response.json()
	});
}

export function writePost(api, data) {
	const uri = `${apiBase}${api}`;
	return fetch(uri, {
		method: 'POST',
		headers: {
			'Content-Type':  'application/json',
		},
		body: JSON.stringify(data),
	});
}

export function loginUser(username) {
	const uri = `${apiBase}/users/login`;
	const data = {uname: username}
	return fetch(uri, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}).then(response => {
		return response.json()
	});
}

export function registerUser(username) {
	const uri = `${apiBase}/users/create`;
	const data = {uname: username}
	return fetch(uri, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}).then(response => {
		return response.json()
	});
}

export function editUser(uid, data) {
	const uri = `${apiBase}/users/${uid}/update`;
	return fetch(uri, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
}

export function deleteUser(uid) {
	const uri = `${apiBase}/users/${uid}/delete`;
	return fetch(uri, {
		method: 'POST',
	});
}

export function getBookmarks(arrayOfPostIds, uid) {
	const uri = `${apiBase}/posts/bookmarked?postids=${arrayOfPostIds.join('.')}&uid=${uid}`
	return fetch(uri)
	.then(response => {
		return response.json()
	});
}

export function getFollowing(uid) {
	const uri = `${apiBase}/users/${uid}/following?mode=short`;
	return fetch(uri)
	.then(response => {
		return response.json()
	})
}

export function getUsernames(arrayOfUsernames) {
	const uri = `${apiBase}/users/unames?userids=${arrayOfUsernames.join('.')}`
	return fetch(uri)
	.then(response => {
		return response.json()
	});
}

export function updateBookmark(uid, post_id, action) {
	const uri = `${apiBase}/users/${uid}/bookmarks/${action}`
	return fetch(uri, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `post_id=${post_id}`,
		});
}
