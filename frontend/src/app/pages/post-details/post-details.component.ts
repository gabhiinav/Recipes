import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { PostService } from '../../post.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    NgOptimizedImage,
    HeaderComponent,
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  Post = inject(PostService);
  router = inject(Router);
  postDetails: any;
  error: any;
  comments: any[] = [];
  newComment = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const postId = params.get('id');
      this.Post.getSinglePost(postId).subscribe({
        next: (value) => {
          console.log(value);
          this.postDetails = Object.values(value)[0];
        },
        error: (error) => {
          this.error = error;
          console.log(error);
        },
      });
      if (postId) {
        this.getComments(postId);
      }
    });
  }

  getPostDetails(postId: string) {
    this.Post.getSinglePost(postId).subscribe(
      (response: any) => {
        this.postDetails = response.singlePost;
      },
      (error) => {
        this.error = error;
        console.log(error);
      }
    );
  }

  getComments(postId: string) {
    this.Post.getCommentsByPostId(postId).subscribe(
      (response: any) => {
        this.comments = response.comments || [];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createComment(postId: string) {
    if (this.newComment.trim()) {
      const comment = { content: this.newComment.trim() };
      this.Post.createComment(postId, comment).subscribe(
        () => {
          this.newComment = '';
          this.getComments(postId);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  deletePost(postId: string) {
    this.Post.deletePost(postId).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
