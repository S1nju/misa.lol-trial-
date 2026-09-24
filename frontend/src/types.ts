export interface ProfileLink {
  label: string;
  url: string;
}

export interface Profile {
  displayName: string;
  bio: string;
  link: ProfileLink;
}

export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string>;
}
