const Header = (props) => {
	const course = props.course;
	return (
		<>
			<h1>{course}</h1>
		</>
	);
};

const Part = (props) => {
	return (
		<>
			<p>
				{props.name} {props.exercises}
			</p>
		</>
	);
};

const Content = (props) => {
	const parts = props.parts;
	return (
		<>
			<Part name={parts[0].name} exercises={parts[0].exercises} />
			<Part name={parts[1].name} exercises={parts[1].exercises} />
			<Part name={parts[2].name} exercises={parts[2].exercises} />
		</>
	);
};

const Total = (props) => {
	return (
		<>
			<p>Number of exercises {props.total}</p>
		</>
	);
};

const App = () => {
	const course = {
		name: "Half Stack application development",
		parts: [
			{ name: "Fundamentals of React", exercises: 10 },
			{ name: "Using props to pass data", exercises: 7 },
			{ name: "State of a component", exercises: 14 },
		],
	};
	return (
		<>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total
				total={
					course.parts[0].exercises +
					course.parts[1].exercises +
					course.parts[2].exercises
				}
			/>
		</>
	);
};

export default App;
