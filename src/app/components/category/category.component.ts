import { Component, inject, OnInit, signal, Renderer2 } from '@angular/core';
import { CategoryService } from '../../services/category.service.js';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  categoryService = inject(CategoryService);

  categoryObj: Category = new Category();
  name: string = '';
  validationError: string | any = null;
  categoryArray: any[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getAll();
  }

  // 00016643 - Submit method to create a category
  onSubmit() {
    this.validationError = null;

    if (this.name.length < 5) {
      this.validationError =
        'Category name must be at least 5 characters long.';
      return;
    }
    this.categoryService.createCategory(this.name).subscribe({
      next: () => {
        alert('Category created successfully');
        this.name = '';
        this.getAll();
      },
      error: (err) => {
        if (err.status === 400 && err.error.errors) {
          const errors = Object.values(err.error.errors).flat();
          this.validationError = errors[0];
        } else if (err.status === 409) {
          this.validationError =
            err.error.message || 'Category name already exists.';
        } else {
          console.log(err);
          alert('Error in creating category');
          this.validationError =
            'An unexpected error occurred. Please try again.';
        }
      },
    });
  }

  // 00016643 - Get all categories
  getAll() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categoryArray = res;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  // 00016643 - Get by id method
  getById(id: number) {
    this.categoryService.getById(id).subscribe({
      next: (res) => {
        this.categoryObj = { ...this.categoryObj, ...res };
      },
    });
  }

  // 000166643 - Edit method to update a category
  onEdit(id: number, item: any) {
    this.openModal();
    this.getById(id);

    this.categoryObj.id = item.categoryId;
    this.categoryObj.name = item.categoryName;
  }

  // 00016643 - Save data
  onSave() {
    this.categoryService
      .updateCategory(this.categoryObj.id, this.categoryObj.name)
      .subscribe({
        next: () => {
          alert('Category updated successfully');
          this.closeModal();
          this.getAll();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // 00016643 - Delete method
  onDelete(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        alert('Category deleted successfully');
        this.getAll();
      },
    });
  }

  openModal() {
    const modal = document.getElementById('editCategoryModal');
    if (modal) {
      this.renderer.addClass(modal, 'show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    document.getElementById('editCategoryModal')?.classList.remove('show');
    document
      .getElementById('exampleModalCenter')
      ?.setAttribute('style', 'display: none;');
  }
}
