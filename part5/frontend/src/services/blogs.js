import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
};

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const likeBlog = async (blog) => {
	let newBlog = {
		author: blog.author,
		title: blog.title,
		url: blog.url,
		user: blog.user.id,
		likes: blog.likes + 1,
	};
	const response = await axios.put(baseUrl.concat("/", blog.id), newBlog);
	return response.data;
};

const create = async (newBlog) => {
	const config = { headers: { Authorization: token } };
	try {
		const response = await axios.post(baseUrl, newBlog, config);
		return response.data;
	} catch {
		(exception) => {
			console.log("error caught");
			console.log("exception: ", exception);
		};
	}
};

const _delete = async (id) => {
	const config = { headers: { Authorization: token } };
	let response = await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, setToken, create, likeBlog, delete: _delete };
