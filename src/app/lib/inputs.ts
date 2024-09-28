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

export interface EventConfigureInput {
  containers: EventConfigureContainer[];
  cpu: string;
  memory: string;
}

export interface EventConfigureContainer {
  env: EventConfigureContainerVariable[];
  ports: EventConfigureContainerPort[];
  volumes: EventConfigureContainerVolume[];
  image: string;
  essential: boolean;
}

export interface EventConfigureContainerVariable {
  key: string;
  value: string;
}

export interface EventConfigureContainerPort {
  container_port: number;
  name: string;
  protocol: string;
}

export interface EventConfigureContainerVolume {
  path: string;
  read_only: boolean;
  source: string;
}

export interface FlagCreateInput {
  difficulty: string;
  env_var: string;
}

export interface FlagUpdateInput extends FlagCreateInput {}
