const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/article', {
    useCreateIndex: true,
    useNewUrlParser: true,
    // useFindAndModify:true
})


// 用户模型
const UserSchema = new mongoose.Schema({
    // 设置username不可重复
    username: { type: String, unique: true },
    password: {
        type: String, set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    createDate: { type: Date }
})

const User = mongoose.model('User', UserSchema)


const CategotySchema = new mongoose.Schema({
    name: { type: String, unique: true},
    createDate: { type: Date },
    updateDate: { type: Date },
    createBy: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    createAccount: { type: String },
    updateBy: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    updateAccount: { type: String }
})

const Category = mongoose.model('Category', CategotySchema);

//文章模型
const ArticleSchema = new mongoose.Schema({
    title: { type: String },
    body: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
    createBy: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    createAccount: { type: String },
    createDate: { type: Date },
    updateDate: { type: Date },
    updateBy: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    updateAccount: { type: String },
})

const Article = mongoose.model('Article', ArticleSchema)

// User.db.dropCollection('users')

module.exports = { Article, User, Category }