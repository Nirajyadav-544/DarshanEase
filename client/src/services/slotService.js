import API from "../api/axios";


// Create Slot

export const createSlot = async(data)=>{


const response =
await API.post(
"/slot/create",
data
);


return response.data;

};




// My Slots

export const getMySlots = async()=>{


const response =
await API.get(
"/slot/my-slots"
);


return response.data;

};