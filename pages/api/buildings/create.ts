import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from '@/utils/cookies.util';
import httpClient from '@/utils/httpClient.util';
import {
  HTTP_METHOD_POST,
  HTTP_METHOD_DELETE,
  HTTP_METHOD_PATCH,
  HTTP_METHOD_GET,
  ACCESS_TOKEN_KEY,
} from "@/utils/constant.util";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === HTTP_METHOD_POST) {
    try {
		const accessToken = req.cookies[ACCESS_TOKEN_KEY];
		if (!accessToken) {
		  return res.status(401).json({ message: 'Unauthorized' });
		}
	
		const createBody = req.body;
		if (req.query) {
		  const { data } = await httpClient.post(`/buildings/create`, createBody, {
			headers: {
			  'Authorization': `Bearer ${accessToken}`,
			},
		  });
		  if(data){
			return res.status(200).json(data);
		  }else{
			return res.status(400).json(data);
		  }
		} else {
		  return res.status(400).json({ message: 'create building is failed' });
		}
	
	  } catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	  }
  }else {
    return res
      .status(405)
      .end(`Error: HTTP ${req.method} is not supported for ${req.url}`);
  }
}
