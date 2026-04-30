"use client";

import { Todo } from "@/lib/type";
import { updateTodo, deleteTodo } from "@/lib/todo";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  return (
    <div className="group flex items-center justify-between rounded-lg border px-4 py-3 transition hover:bg-muted/50">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() =>
            updateTodo(todo.id, { completed: !todo.completed })
          }
        />

        <span
          className={`text-sm transition ${
            todo.completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {todo.text}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition"
        onClick={() => deleteTodo(todo.id)}
      >
        Delete
      </Button>
    </div>
  );
}