const formElement = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('#users')


const socket = io()

// Extracting Username and Room

// const { username, room } = Qs.parse(location.search, {
//     ingoreQueryPrefix : true
// })

const params = new URLSearchParams(window.location.search)
const username = params.get('username')
const room = params.get('room')

// console.log(username, room)

socket.emit('joinRoom', {username, room})

// Listening for and outputting messages
socket.on('message', message => {
    // console.log(message)
    outputMessage(message)
})

socket.on('ioUser', (details) => {
    // console.log(currRoom, users)
    outputRoomName(details)
    outputUsers(details)
})

formElement.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    socket.emit('chatMessage', msg)

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

const outputMessage = (message) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>
    `
    document.querySelector('.chat-messages').appendChild(div)
    chatMessages.scrollTop = chatMessages.scrollHeight
}

const outputRoomName = (currRoom) => {
    console.log('outputRoomName : ', currRoom)
    roomName.innerText = currRoom.room;
}

const outputUsers = (details) => {
    // details.users.map(user => 
    //         userList.innerHTML.appendChild = `<li>${user.username}</li>`
    //     )

    userList.innerHTML = `${details.users.map(user => `<li>${user.username}</li>`).join('')}`

    // details.users.map(user => {
    //     console.log(user.username)
    // })
}