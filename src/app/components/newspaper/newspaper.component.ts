import { Component, OnInit, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewspaperService } from '../../services/newspaper.service.js';
import { Newspaper } from '../../models/newspaper.js';

@Component({
  selector: 'app-newspaper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newspaper.component.html',
  styleUrl: './newspaper.component.scss',
})
export class NewspaperComponent implements OnInit {
  newspaperService = inject(NewspaperService);

  newspaperObj: Newspaper = new Newspaper();
  newspaperArray: any[] = [];
  validationError: string | any = null;
  newspaperName: string = '';
  newspaperDescription: string = '';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getAll();
  }

  openModal() {
    const modal = document.getElementById('exampleModalCenter');
    if (modal) {
      this.renderer.addClass(modal, 'show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    document.getElementById('exampleModalCenter')?.classList.remove('show');
    document
      .getElementById('exampleModalCenter')
      ?.setAttribute('style', 'display: none;');
  }

  getAll() {
    this.newspaperService.getAll().subscribe({
      next: (res) => {
        this.newspaperArray = res;
      },
      error: (err) => {
        console.error('Error fetching newspapers:', err);
      },
    });
  }

  getById(id: number) {
    this.newspaperService.getById(id).subscribe({
      next: (res) => {
        this.newspaperObj = { ...this.newspaperObj, ...res };
      },
    });
  }

  onSubmit() {
    if (this.newspaperName.length < 5) {
      this.validationError =
        'Newspaper name must be at least 5 characters long.';
      return;
    }
    this.newspaperService
      .createNewspaper(this.newspaperName, this.newspaperDescription)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert('Newspaper created successfully');
          this.newspaperName = '';
          this.newspaperDescription = '';
        },
        error: (err) => {
          if (err.status === 400 && err.error.errors) {
            const errors = Object.values(err.error.errors).flat();
            this.validationError = errors[0];
          } else if (err.status === 409) {
            this.validationError =
              err.error.message || 'Newspaper name already exists.';
          } else {
            alert('Error in creating newspaper');
            this.validationError =
              'An unexpected error occurred. Please try again.';
          }
        },
      });
  }

  onEdit(id: number, item: any) {
    this.openModal();
    this.getById(id);
    this.newspaperObj.id = item.newspaperId;
    this.newspaperObj.name = item.newspaperName;
    this.newspaperObj.description = item.newspaperDescription;
  }

  onSave() {
    this.newspaperService
      .updateNewspaper(
        this.newspaperObj.id,
        this.newspaperObj.name,
        this.newspaperObj.description
      )
      .subscribe({
        next: () => {
          alert('Newspaper updated successfully');
          this.closeModal();
          this.getAll();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onDelete(id: number) {
    this.newspaperService.deleteNewspaper(id).subscribe({
      next: () => {
        alert('Newspaper deleted successfully');
        this.getAll();
      },
    });
  }
}
