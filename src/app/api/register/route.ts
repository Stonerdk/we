import { NextResponse } from 'next/server';

interface FormData {
    name: string;
    birthday: string;
    gender: string;
    bio: string;
    email: string;
    password: string;
    ktalkID: string;
    desiredSubjects: string[];
  }

const register = (formData: FormData) => {
    // mocked
    return true;
}

export async function POST(req: Request){
    const formData: FormData = await req.json()
    const isRegistered = register(formData);
    return NextResponse.json({ isRegistered });
}