import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddTask from '../components/AddTask';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://task-manager-bd-a2143e403fa0.herokuapp.com/api/tasks', {
                    headers: { 'x-auth-token': token },
                });
                setTasks(response.data);
            } catch (err) {
                alert('Error fetching tasks');
            }
        };
        fetchTasks();
    }, []);

    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const handleTaskDeleted = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/tasks/${taskId}`, {
                headers: { 'x-auth-token': token },
            });
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (err) {
            alert('Error deleting task');
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTasks(items);
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <AddTask onTaskAdded={handleTaskAdded} />
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {task.title} - {task.priority}
                                            <button onClick={() => handleTaskDeleted(task._id)}>
                                                Delete
                                            </button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Dashboard;
