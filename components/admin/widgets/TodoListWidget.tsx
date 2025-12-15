"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Plus, Trash2, ListTodo } from "lucide-react"

interface Todo {
    id: number
    text: string
    completed: boolean
}

export function TodoListWidget() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState("")

    useEffect(() => {
        const saved = localStorage.getItem("admin-todos")
        if (saved) {
            try {
                setTodos(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse todos", e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("admin-todos", JSON.stringify(todos))
    }, [todos])

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo.trim()) return
        setTodos([{ id: Date.now(), text: newTodo, completed: false }, ...todos])
        setNewTodo("")
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    }

    const removeTodo = (id: number) => {
        setTodos(todos.filter(t => t.id !== id))
    }

    return (
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <ListTodo className="h-5 w-5 text-yellow-400" />
                    </div>
                    Yapılacaklar
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
                <form onSubmit={addTodo} className="flex gap-2">
                    <Input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Hızlı not al..."
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-yellow-500/50"
                    />
                    <Button type="submit" size="icon" className="bg-yellow-500 hover:bg-yellow-600 text-black shrink-0">
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>

                <div className="space-y-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                    {todos.length === 0 && (
                        <p className="text-center text-slate-600 text-sm py-8">Henüz not yok.</p>
                    )}
                    {todos.map(todo => (
                        <div
                            key={todo.id}
                            className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${todo.completed
                                ? "bg-black/20 border-white/5 opacity-50"
                                : "bg-white/5 border-white/10 hover:border-yellow-500/30"
                                }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${todo.completed
                                        ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500"
                                        : "border-slate-600 hover:border-yellow-500/50"
                                        }`}
                                >
                                    {todo.completed && <Check className="w-3 h-3" />}
                                </button>
                                <span className={`text-sm truncate ${todo.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                                    {todo.text}
                                </span>
                            </div>
                            <button
                                onClick={() => removeTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
