"use client";

import { Todo } from "@/lib/type";
import { updateTodo, deleteTodo } from "@/lib/todo";
import { Button } from "@/components/ui/button";

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  return (
    <div className="flex justify-between items-center border p-3 rounded">
      <span
        onClick={() =>
          updateTodo(todo.id, { completed: !todo.completed })
        }
        className={`cursor-pointer ${
          todo.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {todo.text}
      </span>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => deleteTodo(todo.id)}
      >
        Delete
      </Button>
    </div>
  );
}