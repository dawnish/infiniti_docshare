export interface IUser {
  metadata: {
    lastSignInTime?: string;
    creationTime?: string;
  };
  providerData: Array<{
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    photoURL?: string;
    providerId: string;
    uid: string;
  }>;
  photoURL: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  email: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  providerId: string;
  title: string;
  uid: string;
}
