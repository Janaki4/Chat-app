const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generatedMSG, generatedLocation } = require('./utils/messages')
const { addingUser,
    removingUser,
    getUser,
    getUserByRoomName}= require('./utils/user')
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)

const viewPath =path.join(__dirname ,'../public')
// app.set('views', viewPath)
app.use(express.static(viewPath))

app.get('', (req, res) => { 
    res.send('Chat box')
})

io.on('connect', (socket) => { 

    socket.on('join', ({ username, room } , callback) => { 
        const { error, user } = addingUser({ id: socket.id, username, room })
        if (error) { 
            return callback(error)
        }
        
        socket.join(user.room)
        console.log(user.id, user.username,user.room)
        socket.emit('newUser' , generatedMSG(user.username,'welome'))
        socket.broadcast.to(user.room).emit('newUser', generatedMSG(user.username, ` has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            userData:getUserByRoomName(user.room)
        })
        callback()
    })
    // ,username ,room 
    socket.on('sendMessage', (inputData, ack) => {
        const user=getUser(socket.id)
        io.to(user.room).emit('newUser', generatedMSG(user.username ,`${inputData}`))
        ack('msg delivered')
     })

    socket.on('disconnect', () => { 
        const user = removingUser(socket.id)
        if (user) { 
            io.to(user.room).emit('newUser', generatedMSG(user.username, `has left the chat`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                userData:getUserByRoomName(user.room)
            })
        }
        //  
    })
    socket.on('sendLocation', ({ latitude, longitude }, ack) => { 
        const user = getUser(socket.id)
        console.log(user)
        // io.emit('newUser', `https://google.com/maps?q=${latitude},${longitude}`)
        io.to(user.room).emit('location' ,generatedLocation(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
        ack()
    })
})


server.listen(port, () => { 
    console.log('Running on port 3000')
})