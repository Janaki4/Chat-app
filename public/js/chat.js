
const h1 = document.querySelector('h1')
const form = document.querySelector('.msgForm')
const inpField = document.querySelector('.data')
const btn = document.querySelector('.btn')
const locationBtn = document.querySelector('.locationBtn')
const chatSpace = document.querySelector('.chatSpace')



const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix:true})
const socket = io()

socket.on('newUser', (value ,callback) => { 
    const html = `<div><p>${value.username}</p><p>  ${value.msg}  ${moment(value.createdAt).format('hh:mm a')}</p></div>`
        // const space = document.createElement('div')
    chatSpace.insertAdjacentHTML('beforeend', html)
})
socket.on('location', (value) => { 
   

    const locationHTML = `<div> <p>${value.username}</p><p> ${moment(value.createdAt).format('hh:mm a')}-<a target="_blank" href="${value.url}" >Your Location</a> </p></div>`
    chatSpace.insertAdjacentHTML('beforeend' , locationHTML)

    console.log(value)
})


socket.emit('join', { username, room }, (error) => {
    if (error) { 
        alert(error)
        location.href='./'
    }
})


// socket.on('roomData', ({ room, userData }) => { 
//     const [...x] = userData
//     let users=[]
//     x.forEach(element => {
//         users.push(element.username) 
//     });
//     // const p = `
//     // <ul>
//     // {{#userData}}
//     // <li>{{username}}</li>
//     // {{/userData}}
//     // </ul>`
//     users.forEach(user => { 
//         let p 
//         // p.innerText=''
//         p = `<p>${user}</p>`
//         chatSpace.insertAdjacentHTML('beforeend' , p)
//     })
        
    
//     console.log(users)
// })

form.addEventListener('submit', (e) => {
    e.preventDefault()
    btn.disabled=true
    const inputData=inpField.value.trim()
    socket.emit('sendMessage', (inputData ), (val) => {
        // ,username ,room
        btn.disabled = false
        inpField.value=''
        console.log(val)
    })
})


locationBtn.addEventListener('click', () => { 
    locationBtn.disabled=true
    navigator.geolocation.getCurrentPosition((position) => {  
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        socket.emit('sendLocation', { latitude: lat, longitude: lon }, () => { 
            locationBtn.disabled = false
             // console.log('message delivered')

        })
    })
})


