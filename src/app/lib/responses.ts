export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface EventResponse {
  activity_id: string;
  organizer_id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  image_name: string;
  image_repo: string;
  image_tag: string;
  private: boolean;
}
