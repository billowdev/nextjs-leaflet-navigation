import { BuildingPayload } from "@/models/building.model";
import httpClient from "@/utils/httpClient.util";
import axios from 'axios'

export const getBuildings = async (): Promise<BuildingPayload[]> => {
	const response = await httpClient.get(`/buildings/get/all`)
	return response.data.payload;
};

export const getBuilding = async (id: string) => {
	const {data: response} = await httpClient.get(`/buildings/get/${id}`);
	return response.payload;
};

export const createBuilding = async (data: FormData, accessToken:string): Promise<any> => {
	await axios.post(`/buildings/create`, data, {
		headers: {
		  Authorization: `Bearer ${accessToken}`
		},
		baseURL: process.env.NEXT_PUBLIC_BASE_URL_API
	  });
};

export const updateBuilding = async (id:string, data: FormData, accessToken: string): Promise<void> => {
	 await axios.patch(`/buildings/update/${id}`, data, {
		headers: {
		  Authorization: `Bearer ${accessToken}`
		},
		baseURL: process.env.NEXT_PUBLIC_BASE_URL_API
	  });
	

};

export const deleteBuilding = async (id: string): Promise<void> => {
	 await httpClient.delete(`/buildings/${id}`,{
		baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
	});
};


