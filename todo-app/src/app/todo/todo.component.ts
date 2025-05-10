import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  searchTerm = '';
  editingId: number | null = null;
  editedTitle = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data.slice(0, 10);
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;

    const todo: Partial<Todo> = {
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
    };

    this.todoService.addTodo(todo).subscribe((created) => {
      this.todos.unshift(created);
      this.newTodoTitle = '';
    });
  }

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo.id, todo).subscribe();
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id);
    });
  }

  startEdit(todo: Todo) {
    this.editingId = todo.id;
    this.editedTitle = todo.title;
  }

  cancelEdit() {
    this.editingId = null;
    this.editedTitle = '';
  }

  saveEdit(todo: Todo) {
    if (!this.editedTitle.trim()) return;
    todo.title = this.editedTitle;
    this.todoService.updateTodo(todo.id, todo).subscribe(() => {
      this.editingId = null;
      this.editedTitle = '';
    });
  }

  filteredTodos(): Todo[] {
    if (!this.searchTerm.trim()) return this.todos;
    return this.todos.filter(todo =>
      todo.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
