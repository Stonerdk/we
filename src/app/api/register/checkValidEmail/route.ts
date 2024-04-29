import { NextResponse } from "next/server";

const checkDuplicateEmail = async (email: string) => {
    /*
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if (snapshot.empty) {
        console.log('No duplicate emails found.');
        return false;
        } else {
        console.log('Duplicate email found:', email);
        return true;
        }
    } catch (error) {
        console.error('Error checking duplicate email:', error);
        return false;
    }
    */
    // mocked
    if (email in ["sample@aaa.com", "stkd97@gmail.com"])
        return false;
    return true;
}

export async function POST(req: Request) {
    const data: { email: string } = await req.json();
    const { email } = data;
    const isDuplicate = await checkDuplicateEmail(email);
    return NextResponse.json({ isDuplicate });
}