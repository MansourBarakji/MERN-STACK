
export const USER_API_ROUTES ={
    POST:{
        LOGIN_USER:"/user/login",
        RESET_PASS :"/user/resetPassword",
        SEND_EMAIL: "/user/sendResetPasswordEmail",
       
    },
    GET:{
        PROFILE_USER:"/user/profile",
        LOGOUT_USER:"/user/logout",
        REFRESH_TOKEN:"user/refreshUserToken"
       
    },
    PUT:{
        EDIT_USER: "/user/editProfile", 
    }
}