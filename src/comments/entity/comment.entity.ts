import { User } from 'src/users/entity/users.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, eager: true, onDelete: 'CASCADE' })
  @JoinColumn({})
  owner: number;

  @Column({ nullable: false })
  email: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'mediumblob', nullable: true })
  file: Buffer;

  @Column({ nullable: true })
  parentId: number;
}
