import { TaskStatus } from 'src/models/task-status.enum';

export class EditTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
