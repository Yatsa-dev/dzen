import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from 'src/storage/storage.module';
import { UsersModule } from 'src/users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, StorageModule],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
