import {InputPostType, OutputPostType} from "../types/post-types";
import {PostDbType} from "../db/post-db-type";
import {blogCollection, postCollection} from "../db/mongo-db";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";

export const postsMongoQueryRepository = {
    async getPost(): Promise<OutputPostType[]> {
        const posts = await postCollection.find({}).toArray()
        return posts.map(this.postMapToOutput)
    },

    async getPostById(id: string): Promise<OutputPostType | null> {
        const post = await this.findById(new ObjectId(id))
        if (!post) return null
        return this.postMapToOutput(post)
    },

    async findById(id: ObjectId): Promise<PostDbType | null> {
        return await postCollection.findOne({_id: id})
    },

    async findBlogById(input: InputPostType): Promise<BlogDBType | null> {
        return await blogCollection.findOne({_id: new ObjectId(input.blogId)})
    },

    postMapToOutput(post: PostDbType): OutputPostType {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}