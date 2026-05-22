import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Todo } from '../todos/todo.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    virtuals: true,
  },
  toObject: { virtuals: true }
})
export class User {
  // @Prop({
  //   type: String,
  //   default: () => new Types.UUID().toString(),
  //   unique: true,
  //   index: true
  // })
  // id: string;

  @Prop({ 
    type: String, 
    required: false, 
    maxlength: 20,
    trim: true,
    sparse: true
  })
  login: string;

  @Prop({ 
    type: String, 
    required: false, 
    maxlength: 255,
  })
  passwordHash: string | null;

  @Prop({ 
    type: String, 
    required: false, 
    maxlength: 255,
  })
  sessionId: string;

  @Prop({ 
    type: Date, 
    default: null,
    index: true
  })
  deletedAt: Date | null;

  todos?: Todo[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('todos', {
  ref: 'Todo',
  localField: 'id',
  foreignField: 'author',
  justOne: false,
  options: { match: { deletedAt: null } }
});

UserSchema.pre('find', function() {
  this.where({ deletedAt: null });
});

UserSchema.pre('findOne', function() {
  this.where({ deletedAt: null });
});

UserSchema.pre('aggregate', function() {
  this.pipeline().unshift({ $match: { deletedAt: null } });
});

UserSchema.methods = {
  softDelete(): Promise<UserDocument> {
    this.deletedAt = new Date();
    return this.save();
  },

  restore(): Promise<UserDocument> {
    this.deletedAt = null;
    return this.save();
  },
};

UserSchema.statics = {
  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.findOne({ login, deletedAt: null }).exec();
  },

  async findBySessionId(sessionId: string): Promise<UserDocument | null> {
    return this.findOne({ sessionId, deletedAt: null }).exec();
  },

  async findAllWithTodos(): Promise<UserDocument[]> {
    return this.find()
      .populate('todos')
      .exec();
  },

  async findOneWithTodos(id: string): Promise<UserDocument | null> {
    return this.findOne({ id, deletedAt: null })
      .populate('todos')
      .exec();
  }
};