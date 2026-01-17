type key = "ESTIMATED_DELIVERY_DAYS" | "SHIPPING_INFO" | "SUPPORT_EMAIL" | "MAINTENANCE_MODE"

export type SystemSetting = {
    id: number;
    key: key;
    value?: string;
    description?: Record<string, any> | null;
    updatedAt: string;
    createdAt: string;
};

// Cost rule types
type CostRuleType = "FLAT_RATE" | "FREE_OVER";

interface CostRule {
  type: CostRuleType;
  value: number;
  currency: string;
  conditions: string[]; 
}

// Delivery time object
interface DeliveryTime {
  min: number;
  max: number;
}

interface ShippingMethod {
  code: string;
  label: string;
  description: string;
  active: boolean;
  deliveryTimeInDays: DeliveryTime;
  costRules: CostRule[];
  displayPriority: number;
}

interface DeliveryTimeAdjustment {
  minDays: number;
  maxDays: number;
}

interface Region {
  regionCode: string;
  label: string;
  deliveryTimeAdjustment: DeliveryTimeAdjustment;
}

interface GeneralSettings {
  showEstimatedDeliveryAtCheckout: boolean;
  handlingTimeInDays: number[];
  shippingBusinessDays: string[]; // Could also use enum if needed
}

interface Tracking {
  enabled: boolean;
  urlTemplate: string;
}

export interface ShippingSettingsDescription {
  shippingSettingsVersion: string;
  defaultCurrency: string;
  general: GeneralSettings;
  methods: ShippingMethod[];
  regions: Region[];
  tracking: Tracking;
  lastUpdated: string; 
}
