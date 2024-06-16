import axios from "axios";

export async function register(username, password) {
  try {
    const response = await axios.post("http://localhost:8000/users", {
      username,
      password,
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
