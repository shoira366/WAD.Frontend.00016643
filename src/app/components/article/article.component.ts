import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service.js';
import { NewspaperService } from '../../services/newspaper.service.js';
import { CategoryService } from '../../services/category.service.js';
import { Article } from '../../models/article.js';

@Component({
  selector: 'app-article',
  imports: [CommonModule, FormsModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  standalone: true,
})
export class ArticleComponent implements OnInit {
  articleService = inject(ArticleService);
  newspaperService = inject(NewspaperService);
  categoryService = inject(CategoryService);

  newspaperArray: any[] = [];
  categoryArray: any[] = [];
  articleArray: any[] = [];
  newspaperObjArr: any[] = [];
  categoryObjArr: any[] = [];
  articleObj: Article = new Article();

  articleTitle: string = '';
  articleContent: string = '';
  selectedNewspaper: number = 0;
  selectedCategory: number = 0;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getAll();
    this.getNewspapers();
    this.getCategories();
  }

  // 00016643 - Submit method to create an article
  onSubmit() {
    this.articleService
      .createArticle(
        this.articleTitle,
        this.articleContent,
        this.selectedNewspaper,
        this.selectedCategory
      )
      .subscribe({
        next: () => {
          alert('Article created successfully');
          this.getAll();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // 00016643 - Get all articles
  getAll() {
    this.articleService.getAll().subscribe({
      next: async (res) => {
        this.articleArray = res;

        const uniqueNewspaperIds = [
          ...new Set(res.map((article) => article.newspaperId)),
        ];
        const uniqueCategoryIds = [
          ...new Set(res.map((article) => article.categoryId)),
        ];

        try {
          // Fetch all newspapers and categories in parallel using Promise.all
          const [newspapers, categories] = await Promise.all([
            this.fetchAllNewspapers(uniqueNewspaperIds),
            this.fetchAllCategories(uniqueCategoryIds),
          ]);

          this.newspaperObjArr = newspapers;
          this.categoryObjArr = categories;

          this.updateArticleDetails();
        } catch (err) {
          console.error('Error fetching newspapers or categories:', err);
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  // 00016643 - Get by id method
  getById(id: number) {
    this.articleService.getById(id).subscribe({
      next: (res) => {
        this.articleObj = { ...this.articleObj, ...res };
      },
    });
  }

  // 000166643 - Edit method to update an article
  onEdit(id: number, item: any) {
    this.openModal();
    this.getById(id);
    this.selectedNewspaper = item.newspaperId;
    this.selectedCategory = item.categoryId;

    this.articleObj.id = item.articleId;
    this.articleObj.title = item.articleTitle;
    this.articleObj.content = item.articleContent;
    this.articleObj.newspaperId = item.newspaperId;
    this.articleObj.categoryId = item.categoryId;
  }

  // 00016643 - Save data
  onSave() {
    this.articleService
      .updateArticle(
        this.articleObj.id,
        this.articleObj.title,
        this.articleObj.content,
        this.selectedNewspaper,
        this.selectedCategory
      )
      .subscribe({
        next: (res) => {
          alert('Article updated successfully');
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
    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        alert('Article deleted successfully');
        this.getAll();
      },
    });
  }

  fetchAllNewspapers(ids: number[]): Promise<any[]> {
    return Promise.all(
      ids.map((id) => this.newspaperService.getById(id).toPromise())
    );
  }

  fetchAllCategories(ids: number[]): Promise<any[]> {
    return Promise.all(
      ids.map((id) => this.categoryService.getById(id).toPromise())
    );
  }

  // 00016643 - Update ArticleList to show all detailed information about article
  updateArticleDetails() {
    this.articleArray = this.articleArray.map((article) => ({
      ...article,
      newspaperName: this.newspaperObjArr.find(
        (n) => n.newspaperId == article.newspaperId
      ).newspaperName,
      categoryName: this.categoryObjArr.find(
        (c) => c.categoryId == article.categoryId
      )?.categoryName,
    }));
  }

  // 00016643 - Get value when choose select option
  onSelectionChange() {
    this.selectedCategory;
    this.selectedNewspaper;
  }

  // 00016643 - Get all newspapers for selection
  getNewspapers() {
    this.newspaperService.getAll().subscribe({
      next: (res) => {
        this.newspaperArray = res;
      },
      error: (err) => {
        console.error('Error fetching newspapers:', err);
      },
    });
  }

  // 00016643 - Get all categories for selection
  getCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categoryArray = res;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  openModal() {
    const modal = document.getElementById('editArticleModal');
    if (modal) {
      this.renderer.addClass(modal, 'show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    document.getElementById('editArticleModal')?.classList.remove('show');
    document
      .getElementById('editArticleModal')
      ?.setAttribute('style', 'display: none;');
  }
}
