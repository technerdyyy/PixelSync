const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetails(request,response){
    try {
        console.log("Cookies received:", request.cookies);
        const token = request.cookies.token || "";
        console.log("Received Token:", token);

     
     const user = await getUserDetailsFromToken(token)

     return response.status(200).json({
        message : "user details",
        data : user 
     })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        }) 
    }
}

module.exports = userDetails 