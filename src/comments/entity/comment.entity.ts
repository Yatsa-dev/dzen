import { User } from 'src/users/entity/users.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({})
  owner: number;

  @Column({ nullable: false })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: true })
  parentId: number;
}
