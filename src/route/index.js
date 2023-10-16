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
//=================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
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
// ↙️ тут вводимо шлях (PATH) до сторінки
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
// Підключаємо роутер до бек-енду
module.exports = router
