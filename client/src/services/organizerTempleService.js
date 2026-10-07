import API from "../api/axios";


// Add Temple

export const addTemple = async(formData)=>{

const response =
await API.post(
"/organizer/temples",
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);


return response.data;

};




// My Temples

export const getMyTemples = async()=>{


const response =
await API.get(
"/organizer/temples/my"
);


return response.data;

};




// Update Temple

export const updateTemple = async(id,data)=>{


const response =
await API.put(
`/organizer/temples/${id}`,
data
);


return response.data;

};




// Delete Temple

export const deleteTemple = async(id)=>{


const response =
await API.delete(
`/organizer/temples/${id}`
);


return response.data;

};