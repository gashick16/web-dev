// schemas/todo.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type TodoDocument = HydratedDocument<Todo>;

export enum TodoStatus {
  Pending = 'pending',
  Completed = 'completed',
  Archived = 'archived',
}

@Schema({
  timestamps: true,
  collection: 'todos',
})
export class Todo {
  // @Prop({
  //   type: String,
  //   default: () => new Types.UUID().toString(),
  //   unique: true,
  // })
  // id: string;

  @Prop({ 
    type: String, 
    required: true, 
    maxlength: 255 
  })
  title: string;

  @Prop({ 
    type: String, 
    required: false 
  })
  description: string;

  @Prop({
    type: String,
    enum: TodoStatus,
    default: TodoStatus.Pending,
  })
  status: TodoStatus;

  @Prop({ 
    type: Date, 
    default: null 
  })
  deletedAt: Date | null;

  @Prop({ 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true 
  })
  author: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.pre('find', function() {
  this.where({ deletedAt: null });
});

TodoSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});

TodoSchema.methods.softDelete = function() {
  this.deletedAt = new Date();
  return this.save();
};

TodoSchema.methods.restore = function() {
  this.deletedAt = null;
  return this.save();
};