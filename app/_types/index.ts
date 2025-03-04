export interface SigninFormRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface MovieFormRequest {
  title: string;
  year: number;
  image?: File;
}

export interface MovieEntity {
  id: string;
  title: string;
  year: number;
  image: string;
  slug: string;
}
