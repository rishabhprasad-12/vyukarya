import { Document, model, Schema } from "mongoose";
import {
  TASK_PRIORITY,
  TASK_STATUS,
  taskPriority,
  taskStatus,
} from "../utils/contents";

export interface ITask extends Document {
  projectId: Schema.Types.ObjectId;
  title: string;
  description?: string | null;
  status: taskStatus;
  priority: taskPriority;
  dueDate?: Date;
  reporterId: Schema.Types.ObjectId;
  assigneeId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: TASK_STATUS,
      default: "Todo",
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY,
      default: "Medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for scanning tasks within projects quickly
taskSchema.index({ projectId: 1, status: 1 });

const Task = model<ITask>("Task", taskSchema);

export default Task;
