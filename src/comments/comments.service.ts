import { omit } from 'lodash';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsOrder, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { StorageService } from 'src/storage/storage.service';
import { Comment } from './entity/comment.entity';
import { QueryInterface } from './interfaces/query.interfaces';
import { CreateCommentDto } from './dto/create.dto';
import { LIMIT, NOT_FOUND } from './comments.constants';
import {
  NOT_SUPPORTED,
  GIF,
  JPEG,
  PNG,
  TXT,
  LIMIT_SIZE,
  TOO_LARGE,
} from 'src/storage/storage.constants';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
    private storageService: StorageService,
  ) {}

  async create(
    userId: number,
    createCommentDto: CreateCommentDto,
    file?: Express.Multer.File,
  ) {
    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOneBy({
        id: createCommentDto.parentId,
      });
      if (!parentComment) {
        throw new NotFoundException(NOT_FOUND);
      }
    }

    let url: string;
    if (file) {
      const extensionFile = await this.storageService.checkExtensionFile(file);
      if (extensionFile === TXT) {
        if (file.size > LIMIT_SIZE) {
          throw new BadRequestException(TOO_LARGE);
        }
        createCommentDto.file = file.buffer;
      } else if (extensionFile === PNG) {
        url = await this.storageService.validateImageSizeAndGetUrl(file);
      } else if (extensionFile === JPEG) {
        url = await this.storageService.validateImageSizeAndGetUrl(file);
      } else if (extensionFile === GIF) {
        url = await this.storageService.getRawUrl(file);
      } else {
        throw new BadRequestException(NOT_SUPPORTED);
      }
    }
    createCommentDto.image = url;

    const user = await this.usersService.findById(userId);
    createCommentDto.owner = user.id;
    createCommentDto.email = user.email;
    createCommentDto.createdAt = new Date();

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
