import { getDbConnection } from "./db-con";
import type { NewUser, NewPost } from "./schema";
import { user, post, like } from "./schema";
import { eq, desc } from "drizzle-orm";

export const insertNewUser = async (newUser: NewUser) => {
  const db = getDbConnection();
  return db.insert(user).values(newUser);
};
export const getUserById = async (id: string) => {
  const db = getDbConnection();
  return db.select().from(user).where(eq(user.id, id));
};

export const findPostPage = async (page: number) => {
  const db = getDbConnection();
  return db.query.post.findMany({
    with: { author: true },
    orderBy: [desc(post.created)],
    limit: 10,
    offset: page * 10,
  });
};
export type PostWithAuthor = Awaited<ReturnType<typeof findPostPage>>[0];

export const insertPost = async (newPost: NewPost) => {
  const db = getDbConnection();
  return db.insert(post).values(newPost);
};
