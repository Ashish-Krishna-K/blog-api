"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PostsSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    isPublished: { type: Boolean, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
PostsSchema.index({ createdAt: -1, updatedAt: -1 });
const Posts = mongoose_1.default.model('Posts', PostsSchema);
exports.default = Posts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHNNb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcG9zdHNNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFnQztBQUVoQyxNQUFNLE1BQU0sR0FBRyxrQkFBUSxDQUFDLE1BQU0sQ0FBQztBQUUvQixNQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FDNUI7SUFDRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7SUFDdkMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0lBQ3RDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7SUFDdEUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0lBQzlDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQztDQUM3RCxFQUNEO0lBQ0UsVUFBVSxFQUFFLElBQUk7SUFDaEIsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtJQUMxQixRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0NBQzdCLENBQ0YsQ0FBQztBQUVGLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVwRCxNQUFNLEtBQUssR0FBRyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFbkQsa0JBQWUsS0FBSyxDQUFDIn0=