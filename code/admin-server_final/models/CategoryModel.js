/*
能操作categorys集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: String, required: true, default: '0' }
})

// 3. 定义Model(与集合对应, 可以操作集合)
const CategoryModel = mongoose.model('categorys', categorySchema)

CategoryModel.findOne({ name: '家用电器' }).then(category => {
  if (!category) {
    CategoryModel.create({ name: '家用电器', parentId: '0' })
      .then(category => {
        console.log('')
      })
  }
})

// 4. 向外暴露Model
module.exports = CategoryModel