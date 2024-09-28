export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
  email: string;
}

export interface EventCreateInput {
  name: string;
  starts_at: number;
  ends_at: number;
  image_namespace: string;
  image_repository: string;
  image_tag: string;
  private: boolean;
}
