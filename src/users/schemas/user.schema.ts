import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  age: number;

  @Prop()
  role: string;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDelete: boolean;

  @Prop()
  deleteAt: Date;
}
// - name: string
// - email: string <unique>
// - password: string
// - age: number
// - gender: string
// - address: string
// - company: object {_id, name}
// - role: string
// - refreshToken: string;

export const UserSchema = SchemaFactory.createForClass(User);
