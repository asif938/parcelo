import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ShipmentStatus } from "@/types/shipment";

export interface RecentlyViewedShipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  viewedAt: string;
}

interface RecentlyViewedState {
  items: RecentlyViewedShipment[];
  recordVisit: (shipment: Omit<RecentlyViewedShipment, "viewedAt">) => void;
}

const MAX_ITEMS = 5;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      recordVisit: (shipment) =>
        set((state) => ({
          items: [
            { ...shipment, viewedAt: new Date().toISOString() },
            ...state.items.filter((item) => item.id !== shipment.id),
          ].slice(0, MAX_ITEMS),
        })),
    }),
    { name: "parcelo-recently-viewed" },
  ),
);
