
import app from './app/server.js';
import readline from 'readline';
import config from './configs/web.config.js';

// Запуск сервера
const port = process.env.PORT || config.port;

// Запуск сервера
let server = app.listen(port, () => {
    const { address, port } = server.address();
    const hostname = address === '::' ? 'localhost' : address;
    console.log('\x1b[32m%s\x1b[0m', `Server is running at https://${hostname}:${port}`);
});

// Функция для перезапуска сервера
function restartServer() {
    server.close(() => {
        console.log('\x1b[33m%s\x1b[0m', 'Server stopped');
        server = app.listen(port, () => {
            const { address, port } = server.address();
            const hostname = address === '::' ? 'localhost' : address;
            console.log('\x1b[32m%s\x1b[0m', `Server is restarted at https://${hostname}:${port}`);
            rl.resume();
        });
    });
}

// Обработчик события SIGINT для завершения работы сервера
process.on('SIGINT', () => {
    server.close(() => {
        console.log('\x1b[33m%s\x1b[0m', 'Server stopped');
        process.exit(0);
    });
});

// Обработка команд для завершения работы сервера или перезапуска
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (input) => {
    if (input === 'stop') {
        rl.pause();
        rl.question('Вы действительно хотите остановить сервер? (yes/no) ', (answer) => {
            if (answer.toLowerCase() === 'yes') {
                process.emit('SIGINT');
            } else {
                rl.resume();
            }
        });
    } else if (input === 'restart') {
        rl.pause();
        restartServer();
    }
});

process.on('SIGINT', () => {
    rl.close();
});

rl.prompt();
