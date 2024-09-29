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

export interface FlagResponse {
  flag_id: string;
  difficulty: string;
  env_var: string;
}

export interface ParticipantResponse {
  participant_id: string;
  status: string;
  can_invite: boolean;
  can_manage: boolean;
}

export interface UserResponse {
  account_id: string;
  username: string;
  role: string;
}

export interface TaskResponse {
  aws_arn: string;
  ecs_task_definition_id: number;
  ecs_cluster_id: number;
  pull_start: string;
  pull_stop: string;
  started_at: string;
  stopped_at: string;
  stopped_reason: string;
  status: string;
  instance_owner_id: string;
  public_ip: string;
}

export interface FlagHistoryResponse {
  event_id: number;
  flag_id: number;
  timestamp: string;
  redeemer_id: string;
}
