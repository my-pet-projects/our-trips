import {
  date,
  datetime,
  double,
  index,
  int,
  json,
  mysqlSchema,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const mediaLibrarySchema = mysqlTable("media_library", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
});

export const attraction = mysqlTable(
  "Attraction",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    nameLocal: varchar("nameLocal", { length: 191 }),
    description: text("description"),
    address: varchar("address", { length: 191 }),
    latitude: double("latitude").default(0).notNull(),
    longitude: double("longitude").default(0).notNull(),
    isMustSee: tinyint("isMustSee").default(0).notNull(),
    isPredefined: tinyint("isPredefined").default(0).notNull(),
    originalUri: varchar("originalUri", { length: 191 }),
    cityId: varchar("cityId", { length: 191 }).notNull(),
    oldId: int("oldId"),
  },
  (table) => {
    return {
      cityIdIdx: index("Attraction_cityId_idx").on(table.cityId),
      attractionIdPk: primaryKey({
        columns: [table.id],
        name: "Attraction_id_pk",
      }),
    };
  },
);

export const city = mysqlTable(
  "City",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    alternateNames: text("alternateNames"),
    countryCode: varchar("countryCode", { length: 2 }).notNull(),
    admin1Code: varchar("admin1Code", { length: 191 }),
    admin2Code: varchar("admin2Code", { length: 191 }),
    admin3Code: varchar("admin3Code", { length: 191 }),
    admin4Code: varchar("admin4Code", { length: 191 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    modificationDate: date("modificationDate", { mode: "string" }).notNull(),
    population: int("population"),
    latitude: double("latitude").notNull(),
    longitude: double("longitude").notNull(),
  },
  (table) => {
    return {
      countryCodeIdx: index("City_countryCode_idx").on(table.countryCode),
      cityIdPk: primaryKey({ columns: [table.id], name: "City_id_pk" }),
    };
  },
);

export const color = mysqlTable(
  "Color",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      colorIdPk: primaryKey({ columns: [table.id], name: "Color_id_pk" }),
    };
  },
);

export const country = mysqlTable(
  "Country",
  {
    cca2: varchar("cca2", { length: 2 }).notNull(),
    cca3: varchar("cca3", { length: 3 }).notNull(),
    ccn3: varchar("ccn3", { length: 3 }),
    nameCommon: varchar("nameCommon", { length: 191 }).notNull(),
    nameOfficial: varchar("nameOfficial", { length: 191 }).notNull(),
    region: varchar("region", { length: 191 }).notNull(),
    subregion: varchar("subregion", { length: 191 }),
    flagPng: varchar("flagPng", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      countryCca2Pk: primaryKey({
        columns: [table.cca2],
        name: "Country_cca2_pk",
      }),
    };
  },
);

export const direction = mysqlTable(
  "Direction",
  {
    startPlaceId: varchar("startPlaceId", { length: 191 }).notNull(),
    endPlaceId: varchar("endPlaceId", { length: 191 }).notNull(),
    directionsData: json("directionsData").notNull(),
  },
  (table) => {
    return {
      startPlaceIdIdx: index("Direction_startPlaceId_idx").on(
        table.startPlaceId,
      ),
      endPlaceIdIdx: index("Direction_endPlaceId_idx").on(table.endPlaceId),
      directionStartPlaceIdEndPlaceIdKey: unique(
        "Direction_startPlaceId_endPlaceId_key",
      ).on(table.startPlaceId, table.endPlaceId),
    };
  },
);

export const itinerary = mysqlTable(
  "Itinerary",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    tripId: varchar("tripId", { length: 191 }).notNull(),
    order: int("order").notNull(),
    colorId: int("colorId").notNull(),
  },
  (table) => {
    return {
      tripIdIdx: index("Itinerary_tripId_idx").on(table.tripId),
      colorIdIdx: index("Itinerary_colorId_idx").on(table.colorId),
      itineraryIdPk: primaryKey({
        columns: [table.id],
        name: "Itinerary_id_pk",
      }),
    };
  },
);

export const itineraryPlace = mysqlTable(
  "ItineraryPlace",
  {
    id: varchar("id", { length: 191 }).notNull(),
    itineraryId: varchar("itineraryId", { length: 191 }).notNull(),
    attractionId: varchar("attractionId", { length: 191 }).notNull(),
    order: int("order").notNull(),
  },
  (table) => {
    return {
      itineraryIdIdx: index("ItineraryPlace_itineraryId_idx").on(
        table.itineraryId,
      ),
      attractionIdIdx: index("ItineraryPlace_attractionId_idx").on(
        table.attractionId,
      ),
      itineraryPlaceIdPk: primaryKey({
        columns: [table.id],
        name: "ItineraryPlace_id_pk",
      }),
      itineraryPlaceItineraryIdAttractionIdKey: unique(
        "ItineraryPlace_itineraryId_attractionId_key",
      ).on(table.itineraryId, table.attractionId),
    };
  },
);

export const trip = mysqlTable(
  "Trip",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    // startDate: datetime("startDate", { mode: "string", fsp: 6 }),
    // endDate: datetime("endDate", { mode: "string", fsp: 6 }),
    // oldId: int("oldId"),
  },
  (table) => {
    return {
      tripIdPk: primaryKey({ columns: [table.id], name: "Trip_id_pk" }),
    };
  },
);

export const tripDestinations = mysqlTable(
  "TripDestinations",
  {
    tripId: varchar("tripId", { length: 191 }).notNull(),
    countryId: varchar("countryId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      tripIdIdx: index("TripDestinations_tripId_idx").on(table.tripId),
      countryIdIdx: index("TripDestinations_countryId_idx").on(table.countryId),
      tripDestinationsTripIdCountryIdPk: primaryKey({
        columns: [table.tripId, table.countryId],
        name: "TripDestinations_tripId_countryId_pk",
      }),
      tripDestinationsTripIdCountryIdKey: unique(
        "TripDestinations_tripId_countryId_key",
      ).on(table.tripId, table.countryId),
    };
  },
);
