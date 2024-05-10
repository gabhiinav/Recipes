import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PostService } from '../../post.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    NgOptimizedImage,
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  router = inject(Router);
  isLoggedIn: boolean = false;
  allPosts: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  posts = inject(PostService);
  auth = inject(AuthService);

  ngOnInit(): void {
    this.posts.getAllPosts().subscribe({
      next: (value) => {
        this.posts.allPosts = Object.values(value)[0];
      },
      error: (error) => {
        console.log(error);
      },
    });

    if (this.auth.checkAuth()) {
      this.isLoggedIn = true;
    }
  }

  navigateToSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { query: this.searchQuery },
      });
    }
  }

  likePost(postId: string) {
    if (this.isLoggedIn) {
      this.posts.likePost(postId).subscribe(
        (response) => {
          console.log('Post liked successfully:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error liking post:', error);
        }
      );
    } else {
      console.log('Please log in to like a post.');
    }
  }

  unlikePost(postId: string) {
    if (this.isLoggedIn) {
      this.posts.unlikePost(postId).subscribe(
        (response) => {
          console.log('Post unliked successfully:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error unliking post:', error);
        }
      );
    } else {
      console.log('Please log in to unlike a post.');
    }
  }
}


