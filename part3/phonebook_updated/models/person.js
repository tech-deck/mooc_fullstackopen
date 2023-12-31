const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log(`connecting to ${url}`);
mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to mongoDB");
	})
	.catch((error) => {
		console.log("error connecting to mongoDB", error.message);
	});

const personSchema = new mongoose.Schema({
	name: { type: String, minLength: 3 },
	number: {
		type: String,
		validate: {
			validator: (number) => {
				return /(\d){2,3}-{1}(\d)+/.test(number);
			},
			message: (props) => `${props.value} is not a valid number!`,
		},
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
