import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UploadAvatarsService {
    readFile(path:string):fs.ReadStream{
        return fs.createReadStream(path);
    }
}
