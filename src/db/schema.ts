import {
  char,
  integer,
  pgTable,
  varchar,
  uuid,
  timestamp,
  foreignKey,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 64 }).notNull(),
    displayName: varchar("display_name", { length: 64 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    created: timestamp("created").defaultNow().notNull(),
  },
  (table) => {
    return {
      usernameIndex: uniqueIndex("username").on(table.username),
    };
  }
);

export const usersRelations = relations(user, ({ many }) => ({
  posts: many(post),
  likes: many(like),
}));

export type User = InferModel<typeof user>;
export type NewUser = InferModel<typeof user, "insert">;

export const post = pgTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: varchar("content", { length: 256 }).notNull(),
    authorFk: uuid("author_fk")
      .notNull()
      .references(() => user.id),
    created: timestamp("created").notNull().defaultNow(),
    parentPostFk: uuid("parent_post_fk"),
  },
  (table) => {
    return {
      parentReference: foreignKey({
        columns: [table.parentPostFk],
        foreignColumns: [table.id],
      }),
    };
  }
);

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorFk],
    references: [user.id],
  }),
  likes: many(like),
}));

export type Post = InferModel<typeof post>;
export type NewPost = InferModel<typeof post, "insert">;

export const like = pgTable(
  "like",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id),
    dateLiked: timestamp("dateLiked").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.postId),
    };
  }
);

export const likesRelations = relations(like, ({ one }) => ({
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
}));

export type Like = InferModel<typeof like>;
export type NewLike = InferModel<typeof like, "insert">;
