import axios from "axios";

const client = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

export default client;