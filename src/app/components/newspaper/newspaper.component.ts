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
  newspaperName: string = '';
  newspaperDescription: string = '';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getAll();
  }

  // 00016643 - Submit method to create a newspaper
  onSubmit() {
    this.newspaperService
      .createNewspaper(this.newspaperName, this.newspaperDescription)
      .subscribe({
        next: () => {
          alert('Newspaper created successfully');
          this.newspaperName = '';
          this.newspaperDescription = '';
          this.getAll();
        },
        error: (err) => {
          alert(err.message);
          console.log(err);
        },
      });
  }

  // 00016643 - Get all newspapers
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

  // 00016643 - Get by id method
  getById(id: number) {
    this.newspaperService.getById(id).subscribe({
      next: (res) => {
        this.newspaperObj = { ...this.newspaperObj, ...res };
      },
    });
  }

  // 000166643 - Edit method to update a newspaper
  onEdit(id: number, item: any) {
    this.openModal();
    this.getById(id);
    this.newspaperObj.id = item.newspaperId;
    this.newspaperObj.name = item.newspaperName;
    this.newspaperObj.description = item.newspaperDescription;
  }

  // 00016643 - Save data
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

  // 00016643 - Delete method
  onDelete(id: number) {
    this.newspaperService.deleteNewspaper(id).subscribe({
      next: () => {
        alert('Newspaper deleted successfully');
        this.getAll();
      },
    });
  }

  // 00016643 - Function to open the modal
  openModal() {
    const modal = document.getElementById('editNewspaperModal');
    if (modal) {
      this.renderer.addClass(modal, 'show');
      modal.style.display = 'block';
    }
  }

  // 00016643 - Function to close the modal
  closeModal() {
    document.getElementById('editNewspaperModal')?.classList.remove('show');
    document
      .getElementById('exampleModalCenter')
      ?.setAttribute('style', 'display: none;');
  }
}
