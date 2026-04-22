export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenService {
  issueTokens(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<TokenPair>;

  refresh(refreshToken: string): Promise<TokenPair>;

  revoke(userId: string): Promise<void>;
}
