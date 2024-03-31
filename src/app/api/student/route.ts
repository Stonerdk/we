import { NextResponse } from 'next/server';

interface FormData {
  name: string
  grade: string
  gender: string
  bio: string
}

export async function POST(req: Request){
    const formData: FormData = await req.json()
    console.log(formData)
    return NextResponse.json({ message: 'success' })
}

