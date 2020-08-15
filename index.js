const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/formatMessage')
const {userJoin, getCurrentUser, removeUser, roomUsers} = require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000

//Setting a static folder
app.use(express.static(path.join(__dirname, 'public')))

//Listening for websocket connection
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        socket.emit('message', formatMessage('Bot', `Welcome to ${room} discussion`))
    
        //Broadcast that a user has joined
        socket.broadcast.to(user.room).emit('message', formatMessage('Bot', `${username} has joined the chat`))

        io.to(user.room).emit('ioUser', {room : user.room, users : roomUsers(user.room)})
    })



    //Catching the submitted message and emitting to server
    socket.on('chatMessage', message => {
        const currUser = getCurrentUser(socket.id)
        io.to(currUser.room).emit('message', formatMessage(currUser.username, message))
    })

    //Running on disconnection
    socket.on('disconnect', () => {
        const exitUser = removeUser(socket.id)
        // console.log('exited user : ',user)
        io.to(exitUser.room).emit('message', formatMessage('BOT', `${exitUser.username} has left the chat`))

        io.to(exitUser.room).emit('ioUser', {room : exitUser.room, users : roomUsers(exitUser.room)})
    })

})

server.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`)
})