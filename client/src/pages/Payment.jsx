import {
useParams,
useNavigate
}
from "react-router-dom";


import {
makePayment
}
from "../services/paymentService";



function Payment(){


const {bookingId}=useParams();

const navigate=useNavigate();





const pay=async()=>{


try{


const data =
await makePayment(bookingId);



alert(
"Payment Successful"
);



navigate(
`/ticket/${bookingId}`
);



}
catch(error){

alert(
error.response.data.message
);

}


};




return(

<div>


<h1>
💳 Payment
</h1>


<p>
Complete your Darshan booking payment
</p>


<button onClick={pay}>

Pay Now

</button>



</div>

)


}


export default Payment;