// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.password = password
    this.login = login
    this.id = new Date().getTime()
  }
  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }
  static getList = () => this.#list

  static getByID = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  // static updateById = (id, { email }) => {
  static updateById = (id, data) => {
    const user = this.getByID(id)
    if (user) {
      this.update(user, data)
      // if (email) {
      //   user.email = email
      // Object.assign(user, { email })

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
//=================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.trunc(Math.random() * 100000)
    this.createDate = new Date().toISOString()
  }
  static add = (product) => {
    this.#list.push(product)
  }
  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      // Object.assign(product, data)
      if (data.name) {
        product.name = data.name
      }
      if (data.price) {
        product.price = data.price
      }
      if (data.description) {
        product.description = data.description
      }
      return true
    } else {
      return false
    }
  }
}
//=========================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})
//=============================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)
  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: ' Товар успішно додано',
  })
})
//==========================================
router.post('/alert', function (req, res) {
  res.render('alert', {
    style: 'alert',
  })
})
//==========================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
//=================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))
  console.log(product)
  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        id: id,
      },
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      info: 'Товар з даним ID не знайдено',
    })
  }
})
//=================================================================
router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const result = Product.updateById(Number(id), {
    name,
    price,
    description,
  })
  console.log(id, name, price, description)
  console.log(result)

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно змінено'
      : 'Сталася помилка, спробуйте ще раз пізніше',
  })
})
//=================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Товар успішно видалено',
  })
})
//=================================================================

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  res.render('index', {
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: `Користувач створений`,
  })
})
//===================================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: `Користувач видалений`,
  })
})
//==========================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false
  const user = User.getByID(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
    console.log(result)
  }

  console.log(email, password, id)

  res.render('success-info', {
    style: 'success-info',
    info: result ? `Users email is updating` : `ERROR`,
  })
})
//===========================================

// Підключаємо роутер до бек-енду
module.exports = router
