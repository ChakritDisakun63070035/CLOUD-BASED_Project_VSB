# Project_VSB

## Learning Courses Web Application

### How to open 
1. clone or download this project
2. open your code editor
3. open your terminal
4. config database
5. open MySQL Workbench
6. create new schema name = "db"
7. import file db.sql
8. execute file
9. open config.js 
10. แก้ไข password ให้เป็น mysql ของคุณใน file config.js 
11. เปิด terminal
12. npm install
13. npm run serve
14. open http://localhost:3000/
---------------------------------------------------------------
#### User
+ email: test@gmail.com
+ password: test1234

#### Teacher
+ email: teacher@gmail.com
+ password: teacher1234

#### Admin#1 
+ email : ks@email.com
+ password : ks112211

#### Admin#2
+ email: ds@email.com
+ password: ds223322

#### Admin#3
+ email: rt@email.com
+ password: rt334433

#### Admin#4
+ email: km@email.com
+ password: km445544

#### Admin#5
+ email: cd@email.com
+ password: cd556655

#### Admin#6
+ email: sc@email.com
+ password: sc667766

--------------------------------------------------

## หมายเหตุ
+ แต่ละคำสั่งซื้อจะสุ่ม Admin มา Approve payment of user เพราะฉะนั้นเวลาจะอนุมัติการซื้อของผู้เรียนต้อง login role admin ให้ตรงกับ admin ที่รับผิดชอบการซื้อของผู้เรียนนั้น ๆ สามารถดูได้จาก **ตาราง**: order **column**: admin_id ซึ่ง admin จะมีทั้งหมด 6 คน
