const PORT = process.env.PORT
const express = require('express')

//Connecting to Database
require('./db/mongoose')

//Importing Routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, () => console.log(`Server started. Listening at ${PORT}`))