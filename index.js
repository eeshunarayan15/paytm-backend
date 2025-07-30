const express=require('express')
const app=express();

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

require('dotenv').config();
const userRouter=require('./routes/userRouter');
const accountRouter=require('./routes/accountRoutes')
const transactionRouter=require('./routes/transactionRoutes')
const transaction=require('./routes/transactions')
const db = require('./config/mongooseConnection');


app.use('/api/v1/account',accountRouter);
app.use('/api/v1/transaction',transactionRouter);






app.use('/api/v1/user',userRouter);

app.listen(3000)