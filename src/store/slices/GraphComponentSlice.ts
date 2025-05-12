// store/slices/permissionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Permission, PermissionsState} from "../types/GraphComponentTypes"


const initialState: PermissionsState = {
  selected: [],
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setSelectedPermissions(state, action: PayloadAction<Permission[]>) {
      state.selected = action.payload;
    },
  },
});

export const { setSelectedPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
