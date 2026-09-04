import mongoose, { Document, Schema } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  ownerId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index slug for quick URL lookup
workspaceSchema.index({ slug: 1 });

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;
