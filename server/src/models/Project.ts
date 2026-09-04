import { Schema, model, Document } from "mongoose";
import {
  PROJECT_VISIBILITY,
  projectVisibility,
  PROJECT_STATUS,
  projectStatus,
} from "../utils/contents";

export interface IProject extends Document {
  workspaceId: Schema.Types.ObjectId;
  name: string;
  description?: string | null;
  visibility: projectVisibility;
  status: projectStatus;
  creatorId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    visibility: {
      type: String,
      enum: PROJECT_VISIBILITY,
      default: "Public",
    },
    status: {
      type: String,
      enum: PROJECT_STATUS,
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Project = model<IProject>("Project", projectSchema);

export default Project;
