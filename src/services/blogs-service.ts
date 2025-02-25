import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {blogsMongoRepository} from "../repositories/blogs-mongo-repository";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";

export const blogsService = {
    async createBlog(inputBlog: InputBlogType): Promise<Result<{ id: string }>> {
        const createNewBlog: BlogDBType = {
            ...inputBlog,
            _id: new ObjectId(),
            createdAt: dateTimeIsoString(),
            isMembership: false
        }
        const result = await blogsMongoRepository.create(createNewBlog)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },

    async updateBlogById(id: string, inputBlog: InputBlogType): Promise<Result<boolean | null>> {
        const findBlog = await blogsMongoRepository.findById(new ObjectId(id))
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const updateBlog = {
            name: inputBlog.name,
            description: inputBlog.description,
            websiteUrl: inputBlog.websiteUrl
        }
        const result = await blogsMongoRepository.updateById(findBlog, updateBlog)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },

    async deleteBlogById(id: string): Promise<Result<boolean | null>> {
        const findBlog = await blogsMongoRepository.findById(new ObjectId(id))
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const result = await blogsMongoRepository.deleteById(findBlog)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },
}