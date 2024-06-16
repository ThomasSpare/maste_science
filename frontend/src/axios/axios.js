import axios from "axios";

const token = "your-token";

axios.get("/protected", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
