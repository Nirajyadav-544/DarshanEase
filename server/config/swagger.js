const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "Darshan Ease API",

            version: "1.0.0",

            description:
            "Temple Darshan Booking System API Documentation"

        },

components: {

securitySchemes: {

bearerAuth: {

type:"http",

scheme:"bearer",

bearerFormat:"JWT"

}

}

}
,


        servers:[

            {
                url:"http://localhost:5000"
            }

        ]

    },


    apis:[
        "./routes/*.js"
    ]

};



const swaggerSpec =
swaggerJsdoc(options);



module.exports = {

    swaggerUi,

    swaggerSpec

};