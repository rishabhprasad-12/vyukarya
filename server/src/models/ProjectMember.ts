import { Document, model, Schema } from "mongoose";

export interface IProjectMember extends Document {
  projectId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a user cannot be added to the same project twice
projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const ProjectMember = model<IProjectMember>("ProjectMember", projectMemberSchema);

export default ProjectMember;