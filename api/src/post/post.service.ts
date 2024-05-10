import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PostDto } from './post-dto/post.dto';
import { UpdatePostDto } from './update-dto/update.dto';
import { CommentDto } from './comment-dto/comment.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAllPost(): Promise<any> {
    try {
      const allPost = await this.prisma.post.findMany({
        include: { user: true, likedBy: true },
      });
      if (!allPost) {
        throw new NotFoundException('Posts not found');
      }
      return { allPost };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSinglePost(id: string): Promise<any> {
    try {
      const singlePost = await this.prisma.post.findUnique({
        where: { id },
        include: { user: true, likedBy: true },
      });
      if (!singlePost) {
        throw new NotFoundException('Post not found');
      }
      return { singlePost };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createPost(PostDto: PostDto, id: string, cover?: string): Promise<any> {
    try {
      const { title, content, cuisine, ingredients } = PostDto;

      const createdPost = await this.prisma.post.create({
        data: {
          title,
          content,
          cuisine,
          ingredients,
          cover: cover ? cover : null,
          userId: id,
        },
      });

      return { createdPost };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updatePost(
    postId: string,
    UpdatePostDto: UpdatePostDto,
    userId: string,
    cover: string,
  ): Promise<any> {
    try {
      const { title, content, cuisine, ingredients } = UpdatePostDto;

      const existingPost = await this.prisma.post.findUnique({
        where: { id: postId },
      });
      const { cover: oldCover } = existingPost;

      if (!existingPost) {
        throw new NotFoundException('Post not found');
      }

      if (existingPost.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to update this post',
        );
      }

      const updatedPost = await this.prisma.post.update({
        where: { id: postId },
        data: {
          title,
          content,
          cuisine,
          ingredients,
          cover: cover ? cover : oldCover,
        },
      });

      return { updatedPost };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deletePost(postId: string, userId: string): Promise<any> {
    try {
      const existingPost = await this.prisma.post.findUnique({
        where: { id: postId },
      });

      if (!existingPost) {
        throw new NotFoundException('Post not found');
      }

      if (existingPost.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this post',
        );
      }

      await this.prisma.post.delete({
        where: { id: postId },
      });

      return { message: 'Post deleted successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async searchPosts(query: string): Promise<any> {
    try {
      const searchResults = await this.prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              cuisine: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              ingredients: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: { user: true },
      });
      return { searchResults };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  async likePost(postId: string, userId: string): Promise<any> {
    try {
      const existingPost = await this.prisma.post.findUnique({
        where: { id: postId },
        include: { likedBy: true },
      });

      if (!existingPost) {
        throw new NotFoundException('Post not found');
      }

      const existingLike = existingPost.likedBy.find(
        (like) => like.userId === userId,
      );

      if (existingLike) {
        throw new ForbiddenException('You have already liked this post');
      }

      const likedPost = await this.prisma.likedPost.create({
        data: {
          post: { connect: { id: postId } },
          user: { connect: { id: userId } },
        },
      });

      return { likedPost };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async unlikePost(postId: string, userId: string): Promise<any> {
    try {
      const existingLike = await this.prisma.likedPost.findFirst({
        where: {
          postId,
          userId,
        },
      });

      if (!existingLike) {
        throw new NotFoundException('You have not liked this post');
      }

      const unlikedPost = await this.prisma.likedPost.delete({
        where: {
          id: existingLike.id,
        },
      });

      return { message: 'Post unliked successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createComment(
    postId: string,
    userId: string,
    commentDto: CommentDto,
  ): Promise<any> {
    try {
      const { content } = commentDto;

      const comment = await this.prisma.comment.create({
        data: {
          content,
          userId,
          postId,
        },
      });

      return { comment };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCommentsByPostId(postId: string): Promise<any> {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          postId,
        },
        include: {
          user: true,
        },
      });
      
      return { comments };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
