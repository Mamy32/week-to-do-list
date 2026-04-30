"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { signIn, logout } from "@/lib/auth";
import { addTodo, getTodos } from "@/lib/todo";
import { Todo } from "@/lib/type";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import TodoItem from "./TodoItem";

export default function TodoApp() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);

      if (u) {
        const unsubTodos = getTodos(u.uid, setTodos);
        return () => unsubTodos();
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Button onClick={signIn}>Login with Google</Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">My Todos</h1>
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a todo..."
            />
            <Button
              onClick={() => {
                addTodo(user.uid, input);
                setInput("");
              }}
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {todos.length === 0 && (
              <p className="text-sm text-gray-500">No todos yet.</p>
            )}

            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}