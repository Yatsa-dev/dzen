import * as os from 'os';
import * as fs from 'fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY, JIMP, MIME } from './storage.constants';

@Injectable()
export class StorageService {
  constructor(
    @Inject(CLOUDINARY) private cloudinary,
    @Inject(MIME) private mime,
    @Inject(JIMP) private jimp,
  ) {}

  async save(filePath: string) {
    return this.cloudinary.uploader.upload(filePath);
  }

  async transformImage(file: Express.Multer.File) {
    const path = `${os.tmpdir()}/${file.originalname}`;
    const image = await this.jimp.read(file.buffer);
    await image.autocrop().resize(320, 240).writeAsync(path);

    return path;
  }

  async removeFile(filePath: string) {
    return fs.unlink(filePath);
  }

  async writeFile(file: Express.Multer.File) {
    const path = `${os.tmpdir()}/${file.originalname}`;
    await fs.writeFile(path, file.buffer);

    return path;
  }

  async checkExtensionFile(file: Express.Multer.File) {
    return this.mime.getExtension(file.mimetype);
  }

  async getRawUrl(file: Express.Multer.File) {
    const path = await this.writeFile(file);
    const url = await this.save(path);
    await this.removeFile(path);

    return url.secure_url;
  }

  async validateImageSizeAndGetUrl(file: Express.Multer.File) {
    let imagePath: string;
    if (file.size > 320 * 240) {
      const filePath = await this.transformImage(file);
      imagePath = filePath;
    } else {
      const filePath = await this.writeFile(file);
      imagePath = filePath;
    }
    const url = await this.save(imagePath);
    await this.removeFile(imagePath);

    return url.secure_url;
  }
}
