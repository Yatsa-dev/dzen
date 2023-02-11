import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { User } from 'src/decorators/user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.dto';
import { QueryInterface } from './interfaces/query.interfaces';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @Post('create')
  create(@User() user: PayloadDto, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(user.userId, createCommentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('parent')
  findParent(@Query() query: QueryInterface) {
    return this.commentsService.findParent(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('child/:parentId')
  findChilds(@Param('parentId') parentId: number) {
    return this.commentsService.findChilds(parentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':commentId')
  findOne(@Param('commentId') commentId: number) {
    return this.commentsService.findOne(commentId);
  }
}
