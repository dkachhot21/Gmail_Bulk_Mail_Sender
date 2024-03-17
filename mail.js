const dotenv = require('dotenv').config();

module.exports = {
    "emails": [
        {
            "email": process.env.EMAIL1,
            "data": {
                "teamLeadName": "John",
                "details": "Progress report for the week"
            }
        },
        {
            "email": process.env.EMAIL2,
            "data": {
                "teamLeadName": "Alice",
                "details": "Update on project status"
            }
        }
    ]
};
