import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryService {
  constructor(
    private cloudName: string,
    private apiKey: string,
    private apiSecret: string,
  ) {}

  public init(): void {
    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
    });
  }
}
