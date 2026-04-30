"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { signIn, logout } from "@/lib/auth";
import { addTodo, getTodos } from "@/lib/todo";
import { Todo } from "@/lib/type";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <div className="flex h-screen items-center justify-center">
        <Button onClick={signIn}>Login with Google</Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            My Tasks
          </CardTitle>

          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 p-6">
          
          {/* INPUT */}
          <div className="flex gap-2">
            <Input
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-11"
            />

            <Button
              className="h-11"
              onClick={() => {
                addTodo(user.uid, input);
                setInput("");
              }}
            >
              Add
            </Button>
          </div>

          {/* LIST */}
          <div className="space-y-2">
            {todos.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No tasks yet. Add one to get started ✨
              </div>
            ) : (
              todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}