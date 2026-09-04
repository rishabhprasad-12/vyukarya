import { Schema, model, Document } from "mongoose";
import { WORKSPACE_ROLE, workspaceMemberRole } from "../utils/contents";

export interface IWorkspaceMember extends Document {
  workspaceId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  role: workspaceMemberRole;
  joinedAt: Date;
  createdAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: WORKSPACE_ROLE,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a user cannot be added to the same workspace twice
workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

const WorkspaceMember = model<IWorkspaceMember>("WorkspaceMember", workspaceMemberSchema);

export default WorkspaceMember;
