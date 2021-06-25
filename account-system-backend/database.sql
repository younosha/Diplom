CREATE DATABASE family-app

CREATE TABLE users (
    user_id SERIAL,
    email TEXT,
     name TEXT,
       password TEXT  ,
     
)

CREATE TABLE family (
    
    family_id SERIAL,
    family_name TEXT, 
    user_id ,
    lastname,
    name,

)

CREATE TABLE expenses (
    user_id ,
    product_name TEXT ,
    price TEXT 
)



-- {
--     "email":"kostya@mail.ru",
--     "lastname":"Voronnin",
--     "name":"Kostya",
--     "middlename":"Nickolaevich",
--     "password":"1234567kostya"
-- }