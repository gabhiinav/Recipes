import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SearchResponse {
  searchResults: any[];
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  router = inject(Router);
  baseUrl = environment.domain;
  imageBaseUrl = environment.imgDomain;
  http = inject(HttpClient);
  singlePost: any;
  allPosts: any;
  constructor() {}

  createPost(formData: any) {
    return this.http
      .post(this.baseUrl + '/post/create', formData, { withCredentials: true })
      .subscribe({
        next: (value) => {
          console.log(value);
          this.router.navigate(['/']);
        },
        error: (error) => console.log(error),
      });
  }

  getAllPosts() {
    return this.http.get(this.baseUrl + '/post');
  }

  getSinglePost(id: any) {
    return this.http.get(this.baseUrl + '/post/' + id);
  }

  editPost(id: any, updatedPost: FormData) {
    return this.http
      .patch(this.baseUrl + '/post/update/' + id, updatedPost, {
        withCredentials: true,
      })
      .subscribe({
        next: (value) => {
          console.log(value);
          this.router.navigate(['/']);
        },
        error: (error) => console.log(error),
      });
  }

  deletePost(id: any) {
    return this.http.delete(this.baseUrl + '/post/' + id, {
      withCredentials: true,
    });
  }

  searchPosts(query: string): Observable<SearchResponse> {
    const url = `${this.baseUrl}/post/search?query=${query}`;
    return this.http.get<SearchResponse>(url);
  }

  likePost(postId: string) {
    return this.http.post(
      `${this.baseUrl}/post/${postId}/like`,
      {},
      { withCredentials: true }
    );
  }

  unlikePost(postId: string) {
    return this.http.delete(`${this.baseUrl}/post/${postId}/unlike`, {
      withCredentials: true,
    });
  }

  createComment(postId: string, comment: { content: string }) {
    return this.http.post(`${this.baseUrl}/post/${postId}/comment`, comment, {
      withCredentials: true,
    });
  }

  getCommentsByPostId(postId: string): Observable<{ comments: Comment[] }> {
    return this.http.get<{ comments: Comment[] }>(
      `${this.baseUrl}/post/${postId}/comments`
    );
  }
}
