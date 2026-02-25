import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'Falta la URL de la imagen' }, { status: 400 });
    }

    try {
        const fetchRes = await fetch(imageUrl);

        if (!fetchRes.ok) {
            return NextResponse.json({ error: 'Error fetching image from origin' }, { status: fetchRes.status });
        }

        const arrayBuffer = await fetchRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const contentType = fetchRes.headers.get('content-type') || 'application/octet-stream';

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        // Permitir a html2canvas leer la imagen vía CORS
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=86400');

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error proxying image:', error);
        return NextResponse.json({ error: 'Internal Error proxying image' }, { status: 500 });
    }
}
