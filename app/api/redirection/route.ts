import { NextResponse, NextRequest } from 'next/server';
import redirectionMap from '@/app/redirection-states/index';

function isValidHttpUrl(link: string) {
    let url: any;
    
    try {
      url = new URL(link);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

export async function GET(req: NextRequest) {
    const allRedirectionsMap = await redirectionMap.getKeys();
    const allRedirections = allRedirectionsMap.map((redirectKey: string) => {
        return {
            shortUrl: redirectKey,
            redirectTo: redirectionMap.get(redirectKey),
        }
    });

    return NextResponse.json({
      allRedirections
    });
}

export async function PUT(req: NextRequest) {
    const {shortUrl, redirectTo} = await req.json();
    if (!shortUrl) {
        return NextResponse.json({
            message: "shortUrl field is required!"
        }, {
            status: 403,
        });
    }
    if (!redirectTo) {
        return NextResponse.json({
            message: "redirectTo field is required!"
        }, {
            status: 403,
        });
    }

    const keyAlreadyExist = await redirectionMap.isExist(shortUrl)

    if (keyAlreadyExist) {
        return NextResponse.json({
            message: "A redirect with provided shortUrl already exists!"
        }, {
            status: 400,
        });
    }

    if (shortUrl.includes('/')) {
        return NextResponse.json({
            message: "'shortUrl' must be a string without any '/'!"
        }, {
            status: 403,
        });
    }

    if (!isValidHttpUrl(redirectTo)) {
        return NextResponse.json({
            message: "redirect url is not valid!"
        }, {
            status: 403,
        });
    }


    redirectionMap.set(shortUrl, redirectTo);
    return NextResponse.json({
        message: 'Url has been saved'
    });
}

export async function DELETE(req: NextRequest) {
    const {shortUrl} = await req.json();
    if (!shortUrl) {
        return NextResponse.json({
            message: "'shortUrl' field is required!"
        }, {
            status: 403,
        });
    }

    redirectionMap.remove(shortUrl);
    return NextResponse.json({
        message: `Redirect has been removed aganist '/${shortUrl}'`,
    });
}
