const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const { Article, User, Category } = require('../model')

const SECRET = "dsfdsfdsfsdfsdsdfsd"

// 允许跨域访问
app.use(require('cors')())
app.use(express.json())

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const { id } = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/', async (req, res) => {
    res.send('index')
})


// 文章相关请求
app.post('/api/articles/', auth, async (req, res) => {
    req.body.createBy = req.user
    req.body.updateAccount = req.user.username
    req.body.createAccount = req.user.username
    req.body.updateBy = req.user
    const article = await Article.create(req.body)
    res.send({
        status: '200',
        message: "success",
        data: article
    })
})

app.delete('/api/articles/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.send({
        status: "200",
        message: 'success'
    })
})

app.get('/api/articles/', async (req, res) => {
    const article = await Article.find()
    res.send({
        status: "200",
        message: "success",
        data: article
    })
})

//获取文章详情
app.get('/api/articles/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.send({
        status: "200",
        message: "success",
        data: article
    })
})

//修改文章
app.put('/api/articles/:id', auth, async (req, res) => {
    console.log("11111:" + req.body);
    req.body.updateBy = req.user
    req.body.updateAccount = req.user.username
    const article = await Article.findByIdAndUpdate(req.params.id, req.body)
    res.send({
        status: "200",
        message: "success",
        data: article
    })
})

// 用户相关请求
// 查询所有用户信息
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.send({
        data: users,
        status: "200",
        message: "success"
    })
})
// 用户注册接口
app.post('/api/register', async (req, res) => {
    await User.create(req.body, err => {
        if (err) {
            if (err.errmsg.indexOf('E11000 duplicate key error collection') > -1) {
                return res.send({
                    err: err,
                    status: "500",
                    message: `用户名${req.body.username}已存在，请勿重复注册！`,
                })
            } else {
                return res.send({
                    err: err,
                    status: "500",
                    message: `用户名${req.body.username}创建失败，请稍后再试！`,
                })
            }
        } else {
            res.send({
                status: "200",
                message: "success"
            })
        }
    })
    // console.log(user)
    // res.send({
    //     data: user,
    //     status: "200",
    //     message: "success"
    // })
})
// 用户登录
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        return res.send({
            status: "422",
            message: "用户名不存在"
        })
    }
    const isPasswordVaild = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordVaild) {
        return res.send({
            status: "422",
            message: "密码无效"
        })
    }
    // 生成token 
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
        {
            id: String(user._id),

        }, SECRET
    )
    res.send({
        status: "200",
        message: "success",
        data: user,
        token
    })
})

app.get('/api/profile', auth, async (req, res) => {
    res.send(req.user)
})

app.delete('/api/users/:id', async (req, res) => {
    // console.log(req)
    const user = await User.findByIdAndDelete(req.params.id)
    // console.log(user);
    res.send({
        status: "200",
        message: "success"
    })
})



//分类相关接口
app.post('/api/categorys/create', auth, async (req, res) => {
    const user = req.user
    req.body.createBy = req.user
    req.body.createAccount = String(user.username)
    req.body.updateBy = req.user
    req.body.updateAccount = String(user.username)
    req.body.updateDate = new Date()
    req.body.createDate = new Date()
    // const category = Category.create(req.body)
    Category.create(req.body, err => {
        if (err) {
            if (err.errmsg.indexOf('E11000 duplicate key error collection') > -1) {
                return res.send({
                    err: err,
                    status: "500",
                    message: `文章分类${req.body.name}已存在，请勿重复创建！`,
                })
            } else {
                return res.send({
                    err: err,
                    status: "500",
                    message: `文章分类${req.body.name}创建失败，请稍后再试！`,
                })
            }

        } else {
            res.send({
                status: "200",
                message: "success",
                // data: category
            })
        }
    })
})

app.get('/api/categorys/list', async (req, res) => {
    const categorys = await Category.find()
    // console.log(categorys);
    res.send({
        status: "200",
        message: "success",
        data: categorys
    })
})


app.delete('/api/categorys/:id', async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    res.send({
        status: "200",
        message: "success"
    })
})

app.listen(3001, () => {
    console.log('http://localhost:3001')
})