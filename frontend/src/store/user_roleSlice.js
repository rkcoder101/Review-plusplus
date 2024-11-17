import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    role: "none"
}

const roleSlice = createSlice(
    {
        name : "role",
        initialState,
        reducers:{

        }

    }
)

export default roleSlice.reducer;