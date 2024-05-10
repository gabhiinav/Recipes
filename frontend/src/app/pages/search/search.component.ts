import { Component, inject } from '@angular/core';
import { PostService } from '../../post.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

interface SearchResponse {
  searchResults: any[];
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgForOf,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];

  postService = inject(PostService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'] || '';
      this.search();
    });
  }

  search() {
    if (this.searchQuery.trim()) {
      this.postService.searchPosts(this.searchQuery).subscribe(
        (response: SearchResponse) => {
          this.searchResults = response.searchResults;
        },
        (error) => {
          console.error('Error searching posts:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }
}
