import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileClient {
  async fetchUserProfile(userId: number): Promise<unknown> {
    // Simulate external API call
    await new Promise((resolve) => setTimeout(resolve, 1));
    return {
      userId,
      profileData: 'some profile data',
      lastLogin: new Date(),
    };
  }
}
