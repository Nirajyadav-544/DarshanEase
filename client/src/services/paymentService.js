import API from "../api/axios";


// Demo Payment

export const makePayment = async(bookingId)=>{


const response =
await API.post(
"/payment/pay",
{
    bookingId
}
);


return response.data;


};