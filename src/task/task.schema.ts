import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop({required: true})
  title: string;

  @Prop()
  description: string;

  @Prop({required: true})
  date: string;

  @Prop({default: new Date().toString()})
  dateCreated: string;

  @Prop({required: true})
  owner: string;

  @Prop({required: true})
  implementer: string;

  @Prop({default: false})
  closed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);