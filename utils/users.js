const users = []

// Join user to chat
 const userJoin = (id, username, room) => {
     const user = {id, username, room}

     users.push(user)
     return user
 }


 // Get current user
 const getCurrentUser = (id) => {
     return users.find(user => user.id === id)
 }

 // Remove user when they leave
 const removeUser = (id) => {
    users.filter(iterator => iterator.id !== id)
    return users.find(user => user.id === id)
 }

 // Get all users in the room
 const roomUsers = (room) => {
     return users.filter(iterator => iterator.room === room)
 }

 module.exports = {
     userJoin,
     getCurrentUser,
     removeUser,
     roomUsers
 }