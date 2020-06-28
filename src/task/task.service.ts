import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(task: Task): Promise<Task> {
    const createdTask = new this.taskModel(task);
    return createdTask.save();
  }
  async deleteTask(taskId: string): Promise<any> {
    return this.taskModel.remove({_id : taskId});
  }
  async closeTask(taskId: string): Promise<Task> {
    const existedTask = await this.taskModel.findById({_id: taskId});
    existedTask.closed = true;
    return existedTask.save();
  }
  async findTask(searchString: string): Promise<Task[]> {
    const re = new RegExp(searchString,"i");
    return this.taskModel.find({title: re, closed: false});
  }
  async getAllTask(): Promise<Task[]> {
    return this.taskModel.find({});
  }
}
