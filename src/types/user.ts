export type User = {
  id: string;
  email: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  createdAt?: string | number | Date;
  lastSignInAt?: string | number | Date | null;
  clerkId?: string;
  clerkUserId?: string;
  role?: string;
  emailAddresses?: { emailAddress: string; id?: string }[];
  [key: string]: unknown; // for any additional
}