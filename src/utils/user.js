const users = []

const addingUser = ({ id, username, room }) => {
    username = username.toLowerCase().trim()
    room = room.toLowerCase().trim()
    


    if (!username || !room) {
        return {
            error: 'both usernmae and room should be given'
        }
    }


    const existingUser = users.find((user) => {
       return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'User already in the rrom , Please pick another name'
        }


    }
    const user = { id, username, room }
    users.push(user)
    return {user}
}



const removingUser = (id) => { 
    const index = users.findIndex((user) =>user.id === id)
    if (index !== -1) { 
        const user =users.splice(index, 1)[0]
        return user
    }
}


const getUser = (id) => {
    const data = users.find((user) => {
         return user.id===id
    })
    return data
 }


const getUserByRoomName = (room) => { 
    room=room.toLowerCase().trim()
    const data = users.filter((user) => { 
        return user.room === room
    })
    return data
}

module.exports = {
    addingUser,
    removingUser,
    getUser,
    getUserByRoomName
}