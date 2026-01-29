import { EventEmitter } from 'events';

// Patrón Singleton para asegurar que usamos la misma instancia en todas las rutas
// Nota: Esto funciona en desarrollo y deployments de servidor único.
// En Serverless (Vercel) esto NO funcionará consistentemente y requeriría Redis/Pusher.

declare global {
    var eventEmitter: EventEmitter | undefined;
}

export const events = global.eventEmitter || new EventEmitter();

// if (process.env.NODE_ENV !== 'production') {
global.eventEmitter = events;
// }

// Aumentar el límite de listeners para evitar warnings en desarrollo con HMR
events.setMaxListeners(20);
