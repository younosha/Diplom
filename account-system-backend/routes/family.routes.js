const { Router } = require('express');
const jwt = require('jsonwebtoken');
const router = Router();
const pool = require('../db');
const nodemailer = require('nodemailer');
const jwtObjGenerator = require('../utils/jwtObjGenerator');

// family/create-family
// Создаем и приглашаем в семью
router.post(`/create-family`, async (req, res) => {
  try {
    const sentToken = req.body.token;
    const userId = jwt.decode(sentToken);
    // Используя токен,находим id и name пользователя
    const user = await pool.query(
      `SELECT id FROM users WHERE id=${userId.user.id}`
    );
    // Записываем  Id в переменную
    const userIdCheck = user.rows[0].id;
    // Проверяем,создавал ли user семью
    const checkUser = await pool.query(`SELECT id FROM family WHERE id=$1`, [
      userIdCheck,
    ]);

    if (checkUser.rows.length !== 0) {
      return res
        .status(401)
        .json({ message: 'Данный пользователь уже создавал семью' });
    }

    // Создаем семью
    const family = await pool.query(`INSERT INTO family (id)  VALUES($1)`, [
      userIdCheck,
    ]);
    console.log(family)

    // Добавляем информацию в базу family_users,где отображается информация о членах семей
    // Берем ID созданной семьи и ее создателя
    const family_id = await pool.query(
      `SELECT id,family_id FROM family WHERE id=$1`,
      [userIdCheck]
    );

    const familyID = family_id.rows[0].family_id; // хранит ID семьи
    const userID = family_id.rows[0].id; // хранит ID пользователя

    // Создаем запись в family_users,где отображается информация о членах семей
    const family_users = await pool.query(
      `INSERT INTO family_users (id,family_id) VALUES ($1,$2)`,
      [userID, familyID]
    );

    console.log(
      `Семья создана:${(family, family_id)}, ее основатель:${family_users}`
    );
    console.log(family_users);

    res.status(200).json({ message: `ID созданной семьи:${familyID}` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова ' });
  }
});

// family/invite
// Создаем и приглашаем в семью
router.post(`/invite`, async (req, res) => {
  try {
    const sentToken = req.body.token;
    const userId = jwt.decode(sentToken);
    // Используя токен,находим id пользователя,который отправляет приглашение
    const thisUser = await pool.query(
      `SELECT id FROM users WHERE id=${userId.user.id}`
    );
    // Записываем  Id в переменную
    const userIdCheck = thisUser.rows[0].id;
    // Находим ID его семьи
    const family = await pool.query(
      `SELECT family_id FROM family_users WHERE id=$1`,
      [userIdCheck]
    );
    const familyIdCheck = family.rows[0].family_id; // переменная с ID семьи
    const family_token = jwtObjGenerator(familyIdCheck); // создаем токен в котором хранится id семьи

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
    // Находим ID пользователя,которого приглашают
    const invitedUser = await pool.query(
      'SELECT id FROM users WHERE email =$1',
      [email]
    );
    // Записуем ID пользователя которого приглашают в переменную
    const invitedUserId = invitedUser.rows[0].id;

    // Проверяем приглашали уже пользователя в эту семью или нет и состоит ли он в семье
    const checkUserInvite = await pool.query(
      `SELECT id,family_id,family_token FROM family_users WHERE id=$1`,
      [invitedUserId]
    );

    // Состоит пользователь в семье или нет
    const hasToken = checkUserInvite.rows.some(
      (row) => row.family_token === null
    );

    if (hasToken) {
      return res
        .status(401)
        .json({ message: 'Пользователь уже состоит в семье' });
    }
    // Кидали ему приглашение или нет
    const invited = checkUserInvite.rows.find(
      (row) => row.family_id === familyIdCheck
    );
    console.log(invited);
    if (invited) {
      // Если кидали приглашение,обновляем токен
      const updateToken = await pool.query(
        `UPDATE family_users SET family_token=$1 WHERE id=$2`,
        [family_token, invitedUserId]
      );
      console.log(updateToken);
    } else {
      // Если нет,добавляем в базу и создаем токен
      const newFamilyUser = await pool.query(
        `INSERT INTO family_users (family_id,id,family_token) VALUES ($1,$2,$3)`,
        [familyIdCheck, invitedUserId, family_token]
      );

      console.log(`Информация о новом члене семьи:${newFamilyUser}`);
    }

    // Оправка письма
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
      to: req.body.email,
      subject: 'Do you want to join a family? ✔',
      text: 'Letter was sent',
      html: `<h3>Hello if you want to join this, follow  the <a href='http://localhost:3000/join?token=${family_token}'>link</a>`,
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.json({ message: 'Вы успешно пригласили пользователя в вашу семью' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова ' });
  }
});

// family/join
// Получаем информацию о пользователе
router.post(`/join`, async (req, res) => {
  try {
    const familyToken = req.body.family_token;
    const userToken = req.body.token;

    const compareToken = await pool.query(
      `SELECT family_id,id FROM family_users WHERE family_token=$1`,
      [familyToken]
    );

    // Сравниваем есть ли такой токен

    if (compareToken.rows.length === 0) {
      return res.status(401).json({
        message:
          'Неправильный токен,порпобуйте снова. Возможно пользователь уже состоит в семье.',
      });
    }
    // Записываем ID семьи в переменную
    const decodeFamilyToken = jwt.decode(familyToken);
    console.log(decodeFamilyToken);
    const familyIdValue = decodeFamilyToken.obj;
    console.log(familyIdValue);

    // Записываем ID пользователя в переменную
    const decodeUserToken = jwt.decode(userToken);
    console.log(decodeUserToken);
    const userIdValue = decodeUserToken.user.id;
    console.log(userIdValue);

    // Принимаем чувака в семью
    const adoptFamily = await pool.query(
      `UPDATE family_users SET family_token=${null} WHERE id=$1 AND family_id=$2 `,
      [userIdValue, familyIdValue]
    );
    console.log(adoptFamily);
    // Удаляем с базы остальные приглашения,которые не приняты
    const removeOtherFamily = await pool.query(
      `DELETE FROM family_users WHERE id=$1 AND family_token !=${null}`,
      [userIdValue]
    );
    console.log(removeOtherFamily);

    res
      .status(200)
      .json({ message: `Пользователь принял приглашение в семью` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова' });
  }
});

// family/show-family
// Получаем список с
router.get('/show-family', async (req, res) => {
  try {
    const userToken = req.query.token;
    const decodeUserId = jwt.decode(userToken);

    const userId = decodeUserId.user.id;
    // Находим ID семьи
    const familyId = await pool.query(
      `SELECT family_id FROM family_users WHERE id=$1`,
      [userId]
    );

    // Записываем familyId в переменную  WHERE family_users.id=$1 AND family_token IS NULL
    const familyIdValue = familyId.rows[0].family_id;
    // Находим информацию о семье
    const familyMembers = await pool.query(
      `
    SELECT family_users.id,users.name,users.email, SUM(expenses.price) 
      FROM family_users 
      INNER JOIN users   
      ON family_users.id=users.id AND family_token IS NULL AND family_users.family_id=$1
      LEFT JOIN expenses ON expenses.id = family_users.id 
      GROUP BY family_users.id,users.name,users.email`,
      [familyIdValue]
    );
    console.log(familyMembers.rows);
    res.status(200).json(familyMembers.rows);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Возникла ошибка,попробуйте снова' });
  }
});

module.exports = router;

// как менять тип данных,чтобы не забыть
// ALTER TABLE family_users ALTER COLUMN family_id TYPE integer USING (family_id::integer);
