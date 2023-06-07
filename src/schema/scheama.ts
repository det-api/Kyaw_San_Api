import { number, object, string } from "zod";

export const stationDetailSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
    location: string({
      required_error: "location is required",
    }),
    lienseNo: string({
      required_error: "lienseNo is required",
    }),
  }),
});

export const allSchemaId = object({
  query: object({
    _id: string({
      required_error: "no data with that id",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const dailyPriceSchema = object({
  body: object({
    92: number({
      required_error: "92 price is required",
    }),
    95: number({
      required_error: "95 price is required",
    }),
    HSD: number({
      required_error: "HSD price is required",
    }),
    PHSD: number({
      required_error: "PHSD price is required",
    }),
    stationId: string({
      required_error: "station id is required",
    }),
  }),
});

export const dailyReportSchema = object({
  body: object({
    stationId: string({
      required_error: "you need stationId",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const detailSaleSchema = object({
  body: object({
    vocono: string({
      required_error: "vocono is required",
    }),
    nozzleNo: string({
      required_error: "nozzleNo is required",
    }),
    fuelType: string({
      required_error: "fuelType is required",
    }),
  }),
});

export const fuelInSchema = object({
  body: object({
    tankNo: string({
      required_error: "tankNo is required",
    }),
    tankMaxCap: string({
      required_error: "tankMaxCap is required",
    }),
    fuelType: string({
      required_error: "fuelType is required",
    }),
    tankLevel: string({
      required_error: "tankLevel is required",
    }),
    tankLevelLG: string({
      required_error: "tankLevelLG is required",
    }),
    availableToFill: string({
      required_error: "availableToFill is required",
    }),
    tankTemp: string({
      required_error: "tankTemp is required",
    }),
  }),
});
