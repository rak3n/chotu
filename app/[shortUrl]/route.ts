import { NextResponse, NextRequest } from 'next/server';
import redirectionMap from '@/app/redirection-states/index';

export async function GET(req: NextRequest, context: any) {
    const { shortUrl } = context?.params || {};
    const redirectTo = await redirectionMap.get(shortUrl);
    
    if (!shortUrl || !redirectTo) {
        return NextResponse.json({
            message: "redirection not found",
        });
    }
    return NextResponse.redirect(new URL(redirectTo));
}