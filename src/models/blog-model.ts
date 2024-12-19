import mongoose, {Collection} from 'mongoose'
import {Blog} from './schemas/blog'

class BlogDataBase {
    get blogs(): Collection<Blog> {
        return mongoose.connection.collection('blog')
    }
}

export default new BlogDataBase();