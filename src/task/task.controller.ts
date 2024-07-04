import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/dtos/task/createTask.dto';
import { EditTaskDto } from 'src/dtos/task/editTask.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { getUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/auth.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/:id')
  async getTask(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }

  @Get()
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @getUser() user: User,
  ) {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Patch('/:id')
  async updateTask(@Param('id') id: string, @Body() editTastDto: EditTaskDto) {
    return this.taskService.updateTask(id, editTastDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
