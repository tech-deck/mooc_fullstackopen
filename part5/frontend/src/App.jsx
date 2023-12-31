import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Toggleable from "./components/Toggleable";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const blogFormRef = useRef();

	const [notification, setNotification] = useState(null);
	const [notificationColor, setNotificationColor] = useState("");

	const [username, setUsername] = useState([]);
	const [password, setPassword] = useState([]);
	const [user, setUser] = useState(null);

	const [blogs, setBlogs] = useState([]);

	//
	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		const loggedUserJSON =
			window.localStorage.getItem("loggedBloglistUser");
		if (loggedUserJSON !== null) {
			let loggedUser = JSON.parse(loggedUserJSON);
			setUser(loggedUser);
			blogService.setToken(loggedUser.token);
		}
	}, []);

	const blogList = () => {
		return (
			<div>
				<br />
				{blogs
					.sort((a, b) => b.likes - a.likes)
					.map((blog) => (
						<Blog
							key={blog.id}
							blog={blog}
							likeBlog={likeBlog}
							username={user.username}
							deleteBlog={deleteBlog}
						/>
					))}
				<br />
			</div>
		);
	};

	const mainElement = () => {
		//displays either the login form or, if a user is logged in already, a list of blogs
		if (user === null) {
			return (
				<>
					<form id="loginForm" onSubmit={handleLogin}>
						username
						<input
							id="username"
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
						<br />
						password
						<input
							id="password"
							value={password}
							onChange={({ target }) => {
								setPassword(target.value);
							}}
						/>
						<br />
						<button type="submit">login</button>
					</form>
				</>
			);
		} else {
			return (
				<>
					{user.username} is logged in.
					<button onClick={(event) => handleLogout(event)}>
						logout
					</button>
					<br />
					<Toggleable buttonLabel="new blog" ref={blogFormRef}>
						<BlogForm createBlog={addBlog} />
					</Toggleable>
					{blogList()}
				</>
			);
		}
	};

	const addBlog = async (blogObject) => {
		blogFormRef.current.toggleVisibility();
		try {
			const returnedBlog = await blogService.create(blogObject);
			setBlogs(blogs.concat(returnedBlog));
			setNotification(
				`added blog ${returnedBlog.title} by ${returnedBlog.author}`
			);
			setNotificationColor("green");
			setTimeout(() => {
				setNotification(null);
			}, 5000);
			return true;
		} catch {
			return false;
		}
	};

	const likeBlog = async (blog) => {
		const likedBlog = await blogService.likeBlog(blog);
		let newBlogs = blogs.map((blog) =>
			blog.id !== likedBlog.id ? blog : likedBlog
		);
		setBlogs(newBlogs);
	};

	const deleteBlog = async (blog) => {
		if (user !== null) {
			await blogService.delete(blog.id);
			const deletedId = blog.id;
			let newBlogs = blogs.filter((blog) => blog.id !== deletedId);
			setBlogs(newBlogs);
			setNotificationColor("darkOrange");
			setNotification(`deleted blog ${blog.title} by ${blog.author}`);
			setTimeout(() => {
				setNotification(null);
			}, 5000);
		}
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const response = await loginService.login({
				username,
				password,
			});
			const data = response.data;
			setUser(response.data);
			blogService.setToken(data.token);
			window.localStorage.setItem(
				"loggedBloglistUser",
				JSON.stringify(response.data)
			);
			setUsername("");
			setPassword("");
			setNotification(`logged in as ${response.data.username}`);
			setNotificationColor("green");
			setTimeout(() => {
				setNotification(null);
			}, 5000);
		} catch {
			setNotification("invalid credentials.");
			setNotificationColor("red");
			setTimeout(() => {
				setNotification(null);
				setNotificationColor(null);
			}, 5000);
		}
	};

	const handleLogout = async (event) => {
		event.preventDefault();
		setUser(null);
		setUsername("");
		setPassword("");
		setNotification("logged out.");
		setNotificationColor("green");
		setTimeout(() => {
			setNotification(null);
		}, 5000);
		window.localStorage.removeItem("loggedBloglistUser");
	};

	return (
		<div>
			<h2>blogs</h2>
			<Notification message={notification} color={notificationColor} />
			{mainElement()}
		</div>
	);
};

export default App;
