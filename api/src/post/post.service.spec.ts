import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPost', () => {
    it('should return all posts', async () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test Content',
          cover: 'test.jpg',
          cuisine: 'Test Cuisine',
          ingredients: 'Test Ingredients',
          userId: '123',
        },
      ];
      jest
        .spyOn(prismaService.post, 'findMany')
        .mockResolvedValueOnce(mockPosts);

      const result = await service.getAllPost();
      expect(result).toEqual({ allPost: mockPosts });
    });

    it('should return an empty array when no posts found', async () => {
      jest.spyOn(prismaService.post, 'findMany').mockResolvedValueOnce([]);

      const result = await service.getAllPost();
      expect(result).toEqual({ allPost: [] });
    });
  });

  describe('getSinglePost', () => {
    it('should return the post with the given ID', async () => {
      const postId = '1';
      const mockPost = {
        id: postId,
        title: 'Test Post',
        content: 'Test Content',
        cover: 'test.jpg',
        cuisine: 'Test Cuisine',
        ingredients: 'Test Ingredients',
        userId: '123',
      };
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValueOnce(mockPost);

      const result = await service.getSinglePost(postId);
      expect(result).toEqual({ singlePost: mockPost });
    });

    it('should throw NotFoundException when no post found with the given ID', async () => {
      const postId = '1';
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.getSinglePost(postId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const userId = '123';
      const postDto = {
        title: 'Test Post',
        content: 'Test Content',
        cuisine: 'Test Cuisine',
        ingredients: 'Test Ingredients',
      };
      const mockCreatedPost = {
        id: '1',
        ...postDto,
        userId,
        cover: null,
      };
      jest
        .spyOn(prismaService.post, 'create')
        .mockResolvedValueOnce(mockCreatedPost);

      const result = await service.createPost(postDto, userId);
      expect(result).toEqual({ createdPost: mockCreatedPost });
    });
  });
});
