import type { NextApiRequest, NextApiResponse } from 'next';

type LoginResponse = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  const { email, password } = req.body;

  if (email === 'user@example.com' && password === 'password') {
    res.setHeader('Set-Cookie', 'token=valid; path=/; HttpOnly');
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
}
