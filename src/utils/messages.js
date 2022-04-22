const generatedMSG = function (username,msg) { 
    return {
        username,
        msg,
        createdAt:new Date().getTime()
    }
}

const generatedLocation = (username,url) => { 
    return {
        username,
        url,
        createdAt:new Date().getTime()
    }
}


module.exports = {
    generatedMSG,
    generatedLocation
}