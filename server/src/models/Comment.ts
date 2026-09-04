import { Document, model, Schema } from "mongoose";

export interface IComment extends Document {
  taskId: Schema.Types.ObjectId;
  authorId: Schema.Types.ObjectId;
  content: string;
  parentId?: Schema.Types.ObjectId;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
