// zoom.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ZoomService {
  private zoomApiUrl = 'https://api.zoom.us/v2';

  constructor() {}

  async createMeeting(topic: string, startTime: string, endTime: string): Promise<any> {
    const zoomApiKey = process.env.ZOOM_API_KEY;
    const zoomApiSecret = process.env.ZOOM_API_SECRET;
    const starttime = new Date(startTime);
    const endtime = new Date(endTime);

    try {
        const response = await axios.post(
            `${this.zoomApiUrl}/users/me/meetings`,
            {
                topic,
                type: 2, // 2 indicates a scheduled meeting
                start_time: startTime, // Specify the start time for the meeting
                duration: Math.floor((endtime?.getTime() - starttime?.getTime()) / 60000), // Calculate the duration in minutes
            },
            {
                auth: {
                  username: zoomApiKey,
                  password: zoomApiSecret,
                },
                headers: {
                  'Content-Type': 'application/json',
                },
            },
        );

        return response.data;
    } catch (error) {
        console.log("zoom error", error)
        throw error.response.data;
    }
  }
}
