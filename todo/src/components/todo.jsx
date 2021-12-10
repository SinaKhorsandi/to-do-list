import React, { useState } from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'
import { TiEdit } from 'react-icons/ti'
import { RiCheckLine } from 'react-icons/ri'
import TodoForm from './todo-form'


function Todo({ todos, onDelete, onEdit }) {

    const [edit, setEdit] = useState({
        id: null,
        value: ''
    })

    const updateTodo = (value) => {
        onEdit(edit.id, value);
        setEdit({
            id: null,
            value: ''
        })
    }

    if (edit.id) {
        return <TodoForm edit={edit} onSubmit={updateTodo} />
    }


    return todos.map((todo, index) => (
        <div className="todo-row " key={index}>

            <div key={todo.id}>
                {todo.text}
            </div>

            <div className="icons">
                <RiCheckLine

                />
                <RiCloseCircleLine
                    onClick={() => onDelete(todo.id)}
                    className='delete-icon'
                />
                <TiEdit
                    onClick={() => setEdit({ id: todo.id, value: todo.text })}
                    className='edit-icon'
                />
            </div>
        </div>

    ))
}

export default Todo
