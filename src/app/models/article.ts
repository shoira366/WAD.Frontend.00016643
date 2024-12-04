export class Article {
  id: number;
  title: string;
  content: string;
  newspaperId: number;
  categoryId: number;

  constructor() {
    this.id = 0;
    this.title = '';
    this.content = '';
    this.newspaperId = 0;
    this.categoryId = 0;
  }
}
