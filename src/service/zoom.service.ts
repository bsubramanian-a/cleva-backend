// zoom.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { access } from 'fs';

@Injectable()
export class ZoomService {
  private zoomApiUrl = process.env.ZOOM_API_URL;

  constructor() {}

  async createMeeting(topic: string, startTime: string, endTime: string): Promise<any> {
    const starttime = new Date(startTime);
    const endtime = new Date(endTime);

    const zoomApiKey = process.env.SERVER_2_SERVER_KEY;
    const zoomApiSecret = process.env.SERVER_2_SERVER_SECRET;

    const requestBody = {
      grant_type: 'account_credentials',
      account_id: process.env.ZOOM_AUTH_ACCOUNT_ID,
    };

    const headers1 = {
      "Authorization": `Basic ${Buffer.from(`${zoomApiKey}:${zoomApiSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const requestConfig1: AxiosRequestConfig = { // Specify the type of the request configuration
      headers: headers1, // Include the headers
      // Add any other properties you need here 
    };

    const response = await axios.post(
      process.env.ZOOM_ACCESS_TOKEN_URL,
      requestBody,
      requestConfig1
    );

    const accessToken = response.data.access_token;

    const headers = {
      "Authorization": `Bearer ${accessToken}`,
    };    

    const requestConfig: AxiosRequestConfig = { // Specify the type of the request configuration
      headers, // Include the headers
      // Add any other properties you need here 
    };

    try { 
        const response = await axios.post(
            `${this.zoomApiUrl}/users/me/meetings`,
            {
                topic,
                type: 1, // 2 indicates a scheduled meeting
                start_time: startTime, // Specify the start time for the meeting
                duration: Math.floor((endtime?.getTime() - starttime?.getTime()) / 60000), // Calculate the duration in minutes
                is_public: true,
                settings: {
                  join_before_host: true,
                  // host_video: false, // Disable host video
                  // participant_video: false, // Disable participant video
                  // Other meeting settings...
                  // "alternative_hosts": "testawebon1@gmail.com"
                }
            },
            requestConfig
        );

        console.log("zoom created meeting", response);

        return response.data;
    } catch (error) { 
        console.log("zoom error", error)
        throw error.response.data;
    }
  }
}
