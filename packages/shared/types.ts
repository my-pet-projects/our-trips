export type JsonValue = string | number | boolean | null | undefined;
export type JsonArray = JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue | JsonObject | JsonArray;
}
export type Json = JsonValue | JsonObject | JsonArray;
