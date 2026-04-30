import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { Todo } from "./type";

// ADD
export const addTodo = async (
  userId: string,
  text: string
): Promise<void> => {
  if (!text.trim()) return alert("Todo cannot be empty");

  try {
    await addDoc(collection(db, "todos"), {
      userId,
      text,
      completed: false,
      createdAt: new Date(),
    });
  } catch (error: any) {
    alert(error.message);
  }
};

// READ
export const getTodos = (
  userId: string,
  callback: (todos: Todo[]) => void
) => {
  const q = query(collection(db, "todos"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const todos: Todo[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Todo, "id">),
    }));

    callback(todos);
  });
};

// UPDATE
export const updateTodo = async (
  id: string,
  data: Partial<Todo>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "todos", id), data);
  } catch (error: any) {
    alert(error.message);
  }
};

// DELETE
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "todos", id));
  } catch (error: any) {
    alert(error.message);
  }
};