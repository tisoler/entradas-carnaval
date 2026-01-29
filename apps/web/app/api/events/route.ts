import { NextRequest, NextResponse } from 'next/server';
import { events } from '@/lib/events';

export async function GET(request: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            const onUpdate = () => {
                try {
                    // Enviar un mensaje simple para invalidar caché
                    const data = JSON.stringify({ type: 'invalidate' });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                } catch (error) {
                    console.error('Error al enviar evento SSE:', error);
                    controller.close();
                }
            };

            // Escuchar evento 'update'
            events.on('update', onUpdate);

            // Enviar mensaje inicial para establecer conexión
            controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));

            // Limpiar listener cuando se cierra la conexión
            request.signal.addEventListener('abort', () => {
                events.off('update', onUpdate);
                controller.close();
            });
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
