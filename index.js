import express from 'express';
import { spawn } from 'child_process';
import {Server as SocketIO} from 'socket.io';
import http from 'http';
import path from 'path';

const app = express()
const server = http.createServer(app)
const io = new SocketIO(server)
const options = [
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `${25}`,
    '-g', `${25 * 2}`,
    '-keyint_min', 25,
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', 128000 / 4,
    '-f', 'flv',
    `rtmp://a.rtmp.youtube.com/live2/qcwf-ea12-ddy7-hukf-8q8h`,
];

const ffmpegProcess = spawn('ffmpeg', options);

ffmpegProcess.stdout.on('data', data => {
    console.log(`ffmpeg stdout: ${data}`);
})

ffmpegProcess.stderr.on('data', data => {
    console.log(`ffmpeg stderr: ${data}`);
})

ffmpegProcess.on('close', code => {
    console.log(`ffmpeg process exited with code ${code}`);
})

app.use(express.static(path.resolve('./public')))

io.on('connection', socket => {
    console.log('Socket Connected', socket.id)
    socket.on('binarystream', stream => {
        console.log('Binary Stream is here')
        ffmpegProcess.stdin.write(stream, (err) => {
            console.log('Write Error', err)
        })
    })
})


server.listen(3000, () => console.log('Server started on port 3000'))
