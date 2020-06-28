import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';
import {
  ApiResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ responses: undefined, summary: 'Create new task', parameters: [
    {name: 'task', in: 'header', required: true}
  ]})
  @ApiResponse({ status: 201, description: 'Return created task.'})
  @Post('/create/')
  async create(@Body('task') taskData: Task): Promise<Task> {
    return await this.taskService.createTask(taskData);
  }

  @ApiOperation({ summary: 'Remove task by _id', parameters: [
      {name: 'task', in: 'header', required: true}
    ]})
  @ApiResponse({ status: 201, description: 'Return operation status.'})
  @Post('/delete/')
  async delete(
    @Body('taskId') taskId: string,
  ): Promise<any> {
    return await this.taskService.deleteTask(taskId);
  }

  @ApiOperation({ summary: 'Update status certain task', parameters: [
      {name: 'task', in: 'header', required: true}
    ]})
  @ApiResponse({ status: 201, description: 'Return updated task.'})
  @Post('/close/')
  async close(
    @Body('taskId') taskId: string,
  ): Promise<Task> {
    return await this.taskService.closeTask(taskId);
  }

  @ApiOperation({ summary: 'Find task by title' })
  @ApiResponse({ status: 200, description: 'Return founded task list .'})
  @Get()
  async find(
    @Query('searchString') searchString: string
  ): Promise<Task[]> {
    return await this.taskService.findTask(searchString);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return founded task list .'})
  @Get('/all')
  async getAll(): Promise<Task[]> {
    return await this.taskService.getAllTask();
  }
}
