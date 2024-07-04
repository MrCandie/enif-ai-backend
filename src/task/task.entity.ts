import { User } from 'src/auth/auth.entity';
import { TaskStatus } from 'src/models/task-status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  user: User;
}
