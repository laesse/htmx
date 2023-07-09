import { getDbConnection } from "./db-con";
import type { NewUser, NewPost } from "./schema";
import { user, post, like } from "./schema";
import { eq, desc, sql, and } from "drizzle-orm";

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

export const deletePost = async (id: string) => {
  const db = getDbConnection();
  return db.transaction(async (tx) => {
    await tx.delete(like).where(eq(like.postId, id));
    await tx.delete(post).where(eq(post.id, id));
  });
};

export const getLikeCount = async (postId: string) => {
  const db = getDbConnection();
  return db
    .select({ cnt: sql<number>`count(1)` })
    .from(like)
    .where(eq(like.postId, postId));
};
export const hasUserLikedPost = async (userId: string, postId: string) => {
  const db = getDbConnection();
  return (
    (
      await db
        .select()
        .from(like)
        .where(and(eq(like.userId, userId), eq(like.postId, postId)))
    ).length > 0
  );
};

export const likePost = async (userId: string, postId: string) => {
  const db = getDbConnection();
  return db.insert(like).values({ userId, postId });
};

export const remvoeLike = async (userId: string, postId: string) => {
  const db = getDbConnection();
  return db
    .delete(like)
    .where(and(eq(like.userId, userId), eq(like.postId, postId)));
};
