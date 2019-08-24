let apiBase = 'http://localhost:5000'

if (process.env.NODE_ENV === 'production') {
	apiBase = '';
}

export function updateBookmark(uid, post_id, action) {
	return () => {
		uri = `${apiBase}/users/${uid}/bookmarks/${action}`
		fetch(uri, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `post_id=${post_id}`,
  		});
	}
}