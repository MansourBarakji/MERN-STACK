
export const ORDER_API_ROUTES ={
    POST:{
         CREATE_ORDER :"/order",
         DELTE_ORDER :"/order/deleteOrder",
         CANCEL_ORDER :'/order/cancelled',
         RESTORE_ORDER:'/order/restored',
    },
    GET:{
        MY_ORDERS:"/order/user",
    },
    PUT:{
        COMPLETE_ORDER: "/order/processed", 
    },
   
}
