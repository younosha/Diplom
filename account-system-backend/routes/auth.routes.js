const { Router } = require('express');
const router = Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtGenerator = require('../utils/jwtGenerator');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
// const url = require('url');
// const querystring = require('querystring');

// /auth/register
// Регистрация
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        });
      }
      //Получаем данные с фронта
      const { email, name, password } = req.body;
      // Проверяем есть ли такой пользователь \
      const user = await pool.query('SELECT * FROM users WHERE email =$1', [
        email,
      ]);

      if (user.rows.length !== 0) {
        return res
          .status(401)
          .json({ message: 'Такой пользователь уже существует' });
      }

      // Шифрование пароля
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPawword = await bcrypt.hash(password, salt);

      // Добавляем пользователя в базу данных
      const newUser = await pool.query(
        'INSERT INTO users(email,name,password) VALUES($1, $2, $3) RETURNING *',
        [email, name, bcryptPawword]
      );

      //Создаем jwt token
      const token = jwtGenerator(newUser.rows[0].id);
      res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Возникла ошибка,попробуйте снова' });
    }
  }
);

// /auth/login
// Авторизация

router.post('/login', async (req, res) => {
  try {
    console.log(req);
    //Получаем запрос с фронта
    const { email, password } = req.body;
    // Проверяем,существует ли пользователь
    const user = await pool.query('SELECT * FROM users WHERE email =$1', [
      email,
    ]);
    if (user.rows.length === 0) {
      //Значит,что пользователь не существует
      return res.status(401).json({
        message: 'Такого пользователя не существует,пройдите регистрацию',
      });
    }
    // Проверяем совпадают ли пароли
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json('Неправильный логин или пароль');
    }

    // Токен для входа
    const token = jwtGenerator(user.rows[0].id);

    res.json({ token });
    // res.header.json({token})
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова' }, []);
  }
});

// /auth/forgotPassword
//Забыл пароль
router.post('/forgot-password', async (req, res) => {
  try {
    //Получаем данные с фронта
    const { email } = req.body;
    // Провреяем в базе,есть ли такой эмэил
    const user = await pool.query('SELECT * FROM users WHERE email =$1', [
      email,
    ]);
    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Такого пользователя не существует' });
    }
    const token = jwtGenerator(user.rows[0].id);

    //Добавляем токен в базу данных
    const newToken = await pool.query(
      `UPDATE users SET token = '${token}' WHERE email=$1`,
      [email]
    );
    console.log(newToken);
    // let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testmyfamilyapp@gmail.com',
        pass: '55555abcd',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Оправка письма
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <testmyfamilyapp@gmail.com>',
      to: req.body.email,
      subject: 'Do you want to change password? ✔',
      text: 'Letter was sent',
      html: `<h3>Hello if you want to change password, follow  the <a href='http://localhost:3000/reset-password?token=${token}'>link</a>`,
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.json({ status: 200 });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова' });
  }
});

// /auth/resetPassword
// Смена пароля
router.post('/reset-password', async (req, res) => {
  try {
    //Берем токен с фронта
    const sentToken = req.body.token;

    const compareToken = await pool.query(
      `SELECT * FROM users WHERE token=$1`,
      [sentToken]
    );
    // Сравниваем есть ли такой токен

    if (compareToken.rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Неправильный токен,порпобуйте снова' });
    }
    const decodeToken = jwt.decode(sentToken);
    console.log(decodeToken.user.id); // Декодиурем токен,получаем айди пользователя
    // Меняем пароль в базе
    //Получаем новый пароль с фронта
    const newPassword = req.body.password;
    // Шифрование пароля
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptNewPassword = await bcrypt.hash(newPassword, salt);
    //Смена пароля
    const changePassword = await pool.query(
      `UPDATE users SET password = '${bcryptNewPassword}' WHERE id=${decodeToken.user.id}`
      // [decodeToken.user.id]
    );
    console.log(changePassword, 'Ваш пароль успешно изменён');
    // Отправляем письмо о смене пароля
    const userEmail = await pool.query(
      `SELECT email FROM users WHERE id=${decodeToken.user.id}`
    );

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testmyfamilyapp@gmail.com',
        pass: '55555abcd',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <testmyfamilyapp@gmail.com>',
      to: userEmail.rows[0].email,
      subject: 'Your password has updated ✔',
      text: 'Letter was sent',
      html: `<h1>Ваш пароль успешно изменён</h1>`,
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Удаляем токен на замену пароля
    const deleteToken = await pool.query(
      `UPDATE users SET token=${null} WHERE token=$1`,
      [sentToken]
    );

    console.log(deleteToken, 'Токен стёрт');

    return res.status(200).json({ message: 'Пароль успешно изменён' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова' });
  }
});

// /auth/user-info
// Получаем информацию о пользователе
router.get(`/userinfo`, async (req, res) => {
  try {
    const sentToken = req.query.token;

    const decodeToken = jwt.decode(sentToken);
    console.log(decodeToken);
    const userID = decodeToken.user.id;
    console.log(userID);
    const findUser = await pool.query(
      `SELECT users.id,users.email,users.name,family_users.family_id FROM users LEFT JOIN family_users ON users.id=family_users.id AND family_token IS NULL WHERE users.id=$1 `,
      [userID]
    );
    console.log(findUser.rows);
    // const showInfo = findUser.rows;
    // console.log('Информация о пользователе:', showInfo);
    res.status(200).json(findUser.rows[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'незнакомец' });
  }
});

// /auth/changedata
// Смена пароля
router.post('/change-data', async (req, res) => {
  try {
    //Берем токен с фронта
    const sentToken = req.body.token;
    const decodeToken = jwt.decode(sentToken);
    console.log(decodeToken.user.id); // Декодиурем токен,получаем айди пользователя
    const userIdValue = decodeToken.user.id;
    const { email, name,password, newPassword } = req.body;
    // Проверяем старый пароль 
    // Находим пользователя,который хочет сменить пароль 
    const user = await pool.query('SELECT * FROM users WHERE id=$1', [
      userIdValue
    ]);
    if (user.rows.length === 0) {
      //Значит,что пользователь не существует
      return res.status(401).json({
        message: 'Такого пользователя не существует,пройдите регистрацию',
      });
    }
    // Проверяем совпадают ли пароли
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({message:`Для смены пароля,необходимо ввести старый пароль`});
    }
    // Шифрование пароля
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptNewPassword = await bcrypt.hash(newPassword, salt);
    // Обновляем информацию в базе данных
    const changeData = await pool.query(
      `UPDATE users 
      SET email=$1,name=$2,password=$3 WHERE id=$4 `,
      [email, name, bcryptNewPassword, userIdValue]
    );
   
    console.log(changeData)

    return res.status(200).json({ message: 'Данные успешно изменены' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова' });
  }
});

module.exports = router;
