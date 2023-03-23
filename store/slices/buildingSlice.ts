import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, store } from "@/store/store";
import * as buildingService from "@/services/buildingService"
import { BuildingPayload } from "@/models/building.model";

interface BuildingState {
  buildings: BuildingPayload[];

}

const initialState: BuildingState = {
  buildings: []
};

export const getBuilding = createAsyncThunk(
  "buildings/getById",
  async (id: any) => {
    return await buildingService.getBuilding(id);
  }
);

export const getBuildings = createAsyncThunk(
  "buildings/get",
  async () => {
    return await buildingService.getBuildings();
  }
);

export const createBuilding = createAsyncThunk(
  "buildings/create",
  async (data: any) => {
    await buildingService.createBuilding(data);
  }
);

export const updateBuilding = createAsyncThunk(
  "buildings/update",
  async (data:any) => {
    console.log("========== update building slice ============")
    console.log(data)
    console.log("========================================")
    await buildingService.updateBuilding(data.id, data.body, data.accessToken);
  }
);

export const deleteBuilding = createAsyncThunk(
  "buildings/delete",
  async (id: string) => {
    await buildingService.deleteBuilding(id);
    store.dispatch(getBuildings());
  }
);

const buildingSlice = createSlice({
  name: "building",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBuildings.fulfilled, (state, action) => {
      state.buildings = action.payload;
    });
    builder.addCase(getBuilding.fulfilled, (state, action) => {
      state.buildings = action.payload;
    });


  },
});


export const buildingSelector = (store: RootState): BuildingPayload[] | undefined =>
  store.building.buildings;


export default buildingSlice.reducer;
