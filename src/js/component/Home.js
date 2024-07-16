import React, { useState } from "react";

//create your first component
const Home = () => {
	const [todo, setTodo] = useState([]); //usestate es el hook
	const [taskEntry, setTaskEntry] = useState("");
	const taskDelete = (index) => {
		const updatedTodos = todo.filter((_, i) => i !== index);
		setTodo(updatedTodos);
	};

	return (

		<div className="text-center container mt-5">
			<form>
				<div className="mb-3">
					<label for="exampleTodos" className="form-label h1">TODO'S</label>
					<input type="text" className="form-control" id="exampleTodos" aria-describedby="emailHelp" placeholder="What needs to be done?"
						value={taskEntry}
						onChange={(e) => {
							setTaskEntry(e.target.value)
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && taskEntry.trim()) {
								e.preventDefault();
								setTodo([...todo, taskEntry]);
								setTaskEntry("");
							}
						}}
					/>
					<div id="emailHelp" className="form-text">This is your to-do list</div>
					<div className=" d-md-flex justify-content-md-end">
						<button className="btn btn-danger" onClick={() => {
							setTodo([])
						}}>All clear</button></div>
				</div>
				<div className="text-start d-md-flex justify-content-md-start">
					<ul>
						{todo.map((tarea, index) => (
							<li key={index}>
								{tarea}
								<button type="button"
									className="btn btn-sm btn-warning ms-2"
									onClick={() => taskDelete(index)}>
									<i className="fa-regular fa-trash-can"></i></button>
							</li>
						))}
					</ul>
				</div>
			</form>
		</div>
	)

};

export default Home;
