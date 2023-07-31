import { datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const tripDb = mysqlTable("Trip", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  startDate: datetime("startDate"),
  endDate: datetime("endDate"),
});
