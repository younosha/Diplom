const { Router } = require('express');
const jwt = require('jsonwebtoken');
const router = Router();
const pool = require('../db');

//expenses/generateExpenses
// Добавляем трату
router.post('/generate-expenses', async (req, res) => {
  try {
    // Получаем с фронта название товара, цену,дату покупки
    const { productname, price, date } = req.body;
    console.log({ productname, price, date });
    // берем токен,декодируем его,получаем user_id
    const sentToken = req.body.token;
    const userId = jwt.decode(sentToken);
    // Используя токен,находим id и name пользователя
    const user = await pool.query(
      `SELECT id FROM users WHERE id=${userId.user.id}`
    );
    // Записываем  Id в переменную
    console.log(user.rows[0]);

    const userIdCheck = user.rows[0].id;

    console.log('ID пользователя:', userIdCheck);

    // добавляем трату в базу данных
    const newExpenses = await pool.query(
      `INSERT INTO expenses(id, productname,price,date) VALUES($1, $2, $3, $4) RETURNING *`,
      [userIdCheck, productname, price, date]
    );

    console.log(newExpenses.rows[0]);

    res.status(200).json(newExpenses.rows[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Возникла ошибка ,попробуйте снова ',
    });
  }
});

//expenses/showExpenses
//Показываем все траты
router.post('/show-expenses', async (req, res) => {
  try {
    const sentToken = req.body.token;

    const usersId = req.body.usersId;
    // console.log(usersId);
    const decodeToken = jwt.decode(sentToken);
    const userIdValue = decodeToken.user.id; // переменная с ID пользователя
    console.log(userIdValue);
    // Находим ID семьи есть ли есть
    const familyId = await pool.query(
      `SELECT family_id FROM family_users WHERE id=$1`,
      [userIdValue]
    );
    console.log(familyId.rows);

    if (familyId.rows.length === 0) {
      // Пользователь без семьи
      const userInfo = await pool.query(
        `SELECT users.name,expenses.productname,expenses.price,expenses.date
        FROM expenses 
        INNER JOIN users
        ON expenses.id = users.id WHERE users.id =$1
        GROUP BY expenses.productname,expenses.price,expenses.date, users.name 
        ORDER BY expenses.date DESC
         `,
        [userIdValue]
      );
      res.status(200).json(userInfo.rows);
    }

    const familyIdValue = familyId.rows[0].family_id;

    let users = [];
    if (usersId && usersId.length) {
      // Пользователь состоит в семье и применяем фильтр
      users = usersId;
      const showExpenses = await pool.query(
        ` SELECT family_users.id, users.name , expenses.productname, expenses.price, expenses.date
      FROM family_users
      INNER JOIN users
      ON family_users.id = users.id AND family_token IS NULL AND family_users.family_id=$1  AND users.id=ANY ($2)
      INNER JOIN expenses ON expenses.id = family_users.id
      GROUP BY family_users.id, users.name , expenses.productname, expenses.price, expenses.date
      ORDER BY expenses.date DESC`,
        [familyIdValue, usersId]
      );
      res.status(200).json(showExpenses.rows);
    } else {
      const result = await pool.query(
        `
   SELECT family_users.family_id,family_users.id, users.name , expenses.productname, expenses.price, expenses.date
      FROM users
      LEFT JOIN family_users
      ON family_users.id = users.id AND family_token IS NULL AND family_users.family_id =$1
      INNER JOIN expenses ON expenses.id = family_users.id 
      GROUP BY family_users.family_id,family_users.id, users.name , expenses.productname, expenses.price, expenses.date 
      ORDER BY expenses.date DESC`,
        [familyIdValue]
      );
      res.status(200).json(result.rows);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Возникла ошибка ,попробуйте снова ',
    });
  }
});

//expenses/statistics
// Статистика трат
router.post(`/statistics`, async (req, res) => {
  try {
    const sentToken = req.body.token;
    const decodeToken = jwt.decode(sentToken);
    const userIdValue = decodeToken.user.id; // переменная с ID пользователя
    console.log(userIdValue);
    // Показываем траты пользователя
    const expenses = await pool.query(
      `SELECT productname,price,date FROM expenses WHERE id=$1`,
      [userIdValue]
    );
    const expensesValue = expenses.rows;
    console.log(expensesValue);
    res.status(200).json(expensesValue);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Возникла ошибка ,попробуйте снова ',
    });
  }
});

module.exports = router;

