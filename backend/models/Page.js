import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
    {
        id: String,
        type: String,
        label: String,
        value: mongoose.Schema.Types.Mixed,
    },
    { _id: false }
);

const SectionSchema = new mongoose.Schema(
    {
        id: String,
        type: String,
        label: String,
        fields: [FieldSchema],
    },
    { _id: false }
);

const PageSchema = new mongoose.Schema(
    {
        pageKey: { type: String, required: true, unique: true },
        title: String,
        sections: { type: Array, default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("Page", PageSchema, "Home");