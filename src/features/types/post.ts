export type Post = {
  id: string;
  companyName: string;
  body: string;
  authorId: string;
  occupation: string;
  likes: Array<string | undefined | null>;
  createdAt: number;
  updateAt: number | null;
};
