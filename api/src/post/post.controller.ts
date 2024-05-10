import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';
import { PostDto } from './post-dto/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { disk } from '../multerOptions';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdatePostDto } from './update-dto/update.dto';
import { CommentDto } from './comment-dto/comment.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private jwt: JwtService,
  ) {}

  @Get()
  async GetAllPost(@Response() res) {
    try {
      const { allPost } = await this.postService.getAllPost();
      res.status(200).json({
        allPost,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('search')
  async searchPosts(@Query('query') query: string, @Response() res) {
    try {
      const { searchResults } = await this.postService.searchPosts(query);
      res.status(200).json({ searchResults });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':id')
  async GetSinglePost(@Param('id') id: string, @Response() res) {
    try {
      const { singlePost } = await this.postService.getSinglePost(id);
      res.status(200).json({
        singlePost,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('cover', disk))
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Request() req,
    @Response() res,
    @UploadedFile() file: Express.Multer.File,
    @Body() postDto: PostDto,
    id: string,
  ): Promise<any> {
    try {
      const decoded = await this.jwt.decode(req.cookies['token']);
      const id = decoded.user;

      const createdPost = await this.postService.createPost(
        postDto,
        id,
        file.filename,
      );

      res.status(200).json({
        createdPost,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('cover', disk))
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Request() req,
    @Response() res,
    @Param('id') postId: string,
    @Body()
    updatePostDto: UpdatePostDto,
    @UploadedFile() File,
    id: string,
  ): Promise<any> {
    try {
      const decoded = await this.jwt.decode(req.cookies['token']);
      id = decoded.user;
      const updatedPost = await this.postService.updatePost(
        postId,
        updatePostDto,
        id,
        File ? File.filename : undefined,
      );

      res.status(200).json({
        updatedPost,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Request() req,
    @Response() res,
    @Param('id') postId: string,
  ): Promise<any> {
    try {
      const decoded = await this.jwt.decode(req.cookies['token']);
      const userId = decoded.user;

      await this.postService.deletePost(postId, userId);

      res.status(200).json({
        message: 'Post deleted successfully',
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Request() req,
    @Response() res,
    @Param('postId') postId: string,
  ): Promise<any> {
    try {
      const decoded = await this.jwt.decode(req.cookies['token']);
      const userId = decoded.user;
      const { likedPost } = await this.postService.likePost(postId, userId);
      res.status(200).json({ likedPost });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':postId/unlike')
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Request() req,
    @Response() res,
    @Param('postId') postId: string,
  ): Promise<any> {
    try {
      const decoded = await this.jwt.decode(req.cookies['token']);
      const userId = decoded.user;
      const { message } = await this.postService.unlikePost(postId, userId);
      res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post(':postId/comment')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Request() req,
    @Param('postId') postId: string,
    @Body() commentDto: CommentDto,
  ) {
    const decoded = await this.jwt.decode(req.cookies['token']);
    const userId = decoded.user;
    return this.postService.createComment(postId, userId, commentDto);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(@Param('postId') postId: string) {
    return this.postService.getCommentsByPostId(postId);
  }
}
