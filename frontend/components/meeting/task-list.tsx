"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckSquare, Clock, AlertCircle, Plus, Edit, Calendar, User } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  due_date?: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
}

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
}

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    due_date: "",
    priority: "medium" as const,
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const handleStatusChange = (taskId: string, completed: boolean) => {
    onTaskUpdate(taskId, {
      status: completed ? "completed" : "pending",
    })
  }

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleTaskSave = () => {
    if (editingTask) {
      onTaskUpdate(editingTask.id, editingTask)
      setEditingTask(null)
    }
  }

  const handleAddTask = () => {
    // In a real app, this would call an API to create the task
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: "pending",
    }

    // For demo purposes, we'll just add it to the list
    // onTaskUpdate would need to be modified to handle new tasks
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      due_date: "",
      priority: "medium",
    })
    setIsAddingTask(false)
  }

  const groupedTasks = {
    pending: tasks.filter((t) => t.status === "pending"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Action Items</h2>
          <p className="text-muted-foreground">Tasks and action items extracted from the meeting</p>
        </div>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new action item for this meeting</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title..."
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Assigned to..."
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 text-center">
              No action items were extracted from this meeting, or they haven't been processed yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pending Tasks */}
          {groupedTasks.pending.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-gray-500" />
                  <span>Pending ({groupedTasks.pending.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedTasks.pending.map((task) => (
                  <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={handleTaskEdit} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* In Progress Tasks */}
          {groupedTasks.in_progress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>In Progress ({groupedTasks.in_progress.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedTasks.in_progress.map((task) => (
                  <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={handleTaskEdit} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Completed Tasks */}
          {groupedTasks.completed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5 text-green-500" />
                  <span>Completed ({groupedTasks.completed.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedTasks.completed.map((task) => (
                  <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={handleTaskEdit} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-assignee">Assignee</Label>
                  <Input
                    id="edit-assignee"
                    value={editingTask.assignee || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setEditingTask({ ...editingTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={editingTask.due_date || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button onClick={handleTaskSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface TaskItemProps {
  task: Task
  onStatusChange: (taskId: string, completed: boolean) => void
  onEdit: (task: Task) => void
}

function TaskItem({ task, onStatusChange, onEdit }: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <Checkbox
        checked={task.status === "completed"}
        onCheckedChange={(checked) => onStatusChange(task.id, checked as boolean)}
        className="mt-1"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <h4 className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
            {task.title}
          </h4>
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {task.description && (
          <p className={`text-sm text-gray-600 ${task.status === "completed" ? "line-through" : ""}`}>
            {task.description}
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          {task.assignee && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
