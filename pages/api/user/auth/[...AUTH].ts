// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	HTTP_METHOD_POST,
	HTTP_METHOD_GET,
	ACCESS_TOKEN_KEY,
} from "@/utils/constant.util";
import { clearCookie, setCookie } from "@/utils/cookies.util";
import httpClient from "@/utils/httpClient.util";
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { SessionPayload } from "@/models/auth.model";
import { GetSessionResponse } from './../../../../models/auth.model';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.query.AUTH) {
		const action: any = req.query['AUTH'][0]
		if (req.method === HTTP_METHOD_POST && action === "signin") {
			return signin(req, res);
		} else if (req.method === HTTP_METHOD_GET && action === "signout") {
			return signout(req, res);
		} else if (req.method === HTTP_METHOD_GET && action === "session") {
			return getSession(req, res);
		} else {
			return res
				.status(405)
				.end(`Error: HTTP ${req.method} is not supported for ${req.url}`);
		}
	}
}

async function signin(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const { username, password } = req.body
		const response = await httpClient.post(`/users/login`, { username, password });
		const { access_token } = response.data.user;
	
		setCookie(res, ACCESS_TOKEN_KEY, access_token, {
			httpOnly: true,
			// secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			path: "/",
		});
		res.json(response.data);
	} catch (error: any) {
		res.status(400).end();
	}
}

const signout = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	clearCookie(res, ACCESS_TOKEN_KEY);
	res.json({ result: "signout successfuly" });
}

const getSession = async (req: NextApiRequest, res: NextApiResponse<any>) => {
	try {
		const cookies = cookie.parse(req.headers.cookie || "");
		const token = cookies[ACCESS_TOKEN_KEY];
		
		if (token) {
			const response = await httpClient.get<GetSessionResponse>(`/users/getsession`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			res.status(200).json(response.data);
		} else {
			res.status(400).json({ success: false, msg: "token not found" });
		}
	} catch (error: any) {
		res.status(500).json({ success: false, msg: "something wentwrong" });
	}
}
