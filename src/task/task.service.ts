import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from 'src/dtos/task/createTask.dto';
import { TaskStatus } from 'src/models/task-status.enum';
import { EditTaskDto } from 'src/dtos/task/editTask.dto';
import { User } from 'src/auth/auth.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepository: TaskRepository) {}

  async getTask(id: string) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      status: 'Success',
      statusCode: 200,
      data: task,
    };
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description, startDate, endDate } = createTaskDto;

    if (!title || !description || !startDate || !endDate) {
      throw new BadRequestException(
        'Title, description, start date and end date is REQUIRED',
      );
    }

    if (
      new Date(Date.now()) > new Date(endDate) ||
      new Date(startDate) > new Date(endDate)
    ) {
      throw new BadRequestException('Provide a valid end date');
    }

    const task = new Task();
    task.title = title;
    task.description = description;
    task.startDate = new Date(startDate);
    task.endDate = new Date(endDate);
    task.status = TaskStatus.PENDING;
    task.createdAt = new Date(Date.now());
    task.updatedAt = new Date(Date.now());
    task.user = user;

    await this.taskRepository.save(task);

    return {
      status: 'Success',
      statusCode: 201,
      data: task,
    };
  }

  async getAllTasks() {
    const tasks = await this.taskRepository.find();
    return {
      status: 'Success',
      statusCode: 200,
      data: tasks,
    };
  }

  async updateTask(id: string, editTaskDto: EditTaskDto) {
    const { title, description, status } = editTaskDto;
    const task = await this.taskRepository.findOneBy({ id });

    if (
      status?.toUpperCase() !== 'IN_PROGRESS' &&
      status?.toUpperCase() !== 'COMPLETED'
    ) {
      throw new BadRequestException(
        'Invalid status (STATUS CAN ONLY BE IN_PROGRESS OR COMPLETED',
      );
    }
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.title = title ? title : task.title;
    task.description = description ? description : task.description;
    task.status = status ? status : task.status;

    await this.taskRepository.save(task);

    return {
      status: 'Success',
      statusCode: 200,
      data: task,
    };
  }

  async deleteTask(id: string) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.remove(task);

    return {
      status: 'Success',
      statusCode: 204,
      data: null,
    };
  }
}
