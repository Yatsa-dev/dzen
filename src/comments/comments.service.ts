import { omit } from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FindOptionsOrder, IsNull, Repository } from 'typeorm';
import { LIMIT, NOT_FOUND } from './comments.constants';
import { CreateCommentDto } from './dto/create.dto';
import { Comment } from './entity/comment.entity';
import { QueryInterface } from './interfaces/query.interfaces';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOneBy({
        id: createCommentDto.parentId,
      });
      if (!parentComment) {
        throw new NotFoundException(NOT_FOUND);
      }
    }
    const user = await this.usersService.findById(userId);
    createCommentDto.owner = user.id;
    createCommentDto.email = user.email;

    return this.commentsRepository.save(createCommentDto);
  }

  parseFilter(query: QueryInterface) {
    const filter = {} as FindOptionsOrder<Comment> as any;
    if (query.date) filter.createdAt = query.date;
    if (query.name) filter.owner = { username: query.name };
    if (query.email) filter.email = query.email;

    return filter;
  }

  async findParent(query: QueryInterface) {
    const filter = this.parseFilter(query);
    const comments = await this.commentsRepository.find({
      where: [{ parentId: IsNull() }],
      order: filter,
      take: LIMIT,
    });

    return comments.map((item) =>
      omit(item, ['owner.id', 'owner.password', 'owner.email']),
    );
  }

  async findChilds(parentId: number) {
    const comments = await this.commentsRepository.find({
      where: { parentId },
      take: LIMIT,
    });
    return comments.map((item) =>
      omit(item, ['owner.id', 'owner.password', 'owner.email']),
    );
  }

  async findOne(id: number) {
    return this.commentsRepository.findOneBy({ id });
  }
}
