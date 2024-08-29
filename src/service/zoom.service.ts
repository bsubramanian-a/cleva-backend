// zoom.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { access } from 'fs';

@Injectable()
export class ZoomService {
  private zoomApiUrl = process.env.ZOOM_API_URL;

  constructor() { }

  async createMeeting(topic: string, startTime: Date, endTime: Date, userId: string, coachId: string): Promise<any> {
    //console.log("createMeeting", startTime, endTime);
    const starttime = new Date(startTime);
    const endtime = new Date(endTime);

    //console.log("createMeeting dates", starttime, endtime);

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
      headers: headers1,
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

    const requestConfig: AxiosRequestConfig = {
      headers,
    };

    try {
      // const response = await axios.get(
      //   `${this.zoomApiUrl}/meetings/81675575808`, requestConfig
      // );
      const response = await axios.post(
          `${this.zoomApiUrl}/users/z3Vu00vuRm6XktiHEuEsiA/meetings`,
          {
              topic,
              type: 3, // 2 indicates a scheduled meeting
              start_time: startTime, // Specify the start time for the meeting
              duration: Math.floor((endtime?.getTime() - starttime?.getTime()) / 60000),
              is_public: true,
              settings: {
                join_before_host: true,
                // host_video: false, // Disable host video
                // participant_video: false, // Disable participant video
                // Other meeting settings...
                // "alternative_hosts": "testawebon1@gmail.com"
                auto_recording: "cloud"
              }
          },
          requestConfig
      );

      // //console.log("zoom created meeting", response);

      return response.data;
    } catch (error) {
      //console.log("zoom error", error)
      throw error.response.data;
    }
  }
}
