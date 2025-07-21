export type Market = {
  // 🔹 Identification & Titles
  ticker: string;                      // Unique identifier for markets
  event_ticker: string;               // Unique identifier for events
  market_type: "binary" | "scalar";   // Market structure: binary or scalar
  title: string;                      // Full title describing this market
  subtitle: string;                   // Deprecated: use yes/no sub-titles instead
  yes_sub_title: string;             // Shortened title for the YES side
  no_sub_title: string;              // Shortened title for the NO side
  category: string;                  // Deprecated: category for this market

  // 🕒 Timing & Lifecycle
  open_time: string;                 // When trading opens (ISO 8601)
  close_time: string;                // When trading closes (ISO 8601)
  expected_expiration_time?: string; // Anticipated expiration time (optional)
  expiration_time: string;           // When the market officially expires (ISO 8601)
  latest_expiration_time: string;    // Final possible expiration time
  fee_waiver_expiration_time?: string; // Time when fee waivers end
  can_close_early: boolean;          // Whether the market can close earlier than close_time
  status: string;                    // Current market status (e.g., OPEN, CLOSED, SETTLED)

  // 📈 Price Quotes (Current & Historical)
  yes_bid: number;                   // Best buy price for YES (in price units)
  yes_ask: number;                   // Best sell price for YES
  no_bid: number;                    // Best buy price for NO
  no_ask: number;                    // Best sell price for NO
  last_price: number;               // Last traded YES price
  previous_yes_bid: number;         // YES bid from a day ago
  previous_yes_ask: number;         // YES ask from a day ago
  previous_price: number;           // Last traded YES price from a day ago

  // 📊 Market Metrics
  volume: number;                   // Total contracts bought
  volume_24h: number;               // Contracts bought in last 24 hours
  open_interest: number;           // Active positions not yet closed
  liquidity: number;               // Total current offers in cents
  notional_value: number;          // Value per contract at settlement
  tick_size: number;               // Minimum price increment
  response_price_units: "usd_cent" | "usd_centi_cent"; // Price unit format

  // 🧮 Strike Definitions
  strike_type:
    | "unknown"
    | "greater"
    | "greater_or_equal"
    | "less"
    | "less_or_equal"
    | "between"
    | "functional"
    | "custom"
    | "structured";                 // Determines how expiration is interpreted

  cap_strike?: number;             // Max strike value for "less"/"between"
  floor_strike?: number;           // Min strike value for "greater"/"between"
  functional_strike?: string;      // Math formula for scalar markets
  custom_strike?: Record<string, string>; // Expiration values leading to YES

  // ⚖️ Settlement & Result
  expiration_value: string;        // The observed value at expiration
  result:
    | "yes"
    | "no"
    | "void"
    | "scalar"
    | "all_no"
    | "all_yes"
    | "MARKET_RESULT_NO_RESULT";   // Outcome after settlement
  settlement_value?: number;       // Payout value for YES/LONG (if applicable)
  settlement_timer_seconds: number; // Time until payout after resolution

  // 📜 Market Rules
  rules_primary: string;           // Plain-language key rules
  rules_secondary: string;         // Secondary market rule details

  // 💡 Deprecated / Legacy
  risk_limit_cents: number;        // Deprecated: risk limit in cents
};


export type KalshiMarketsResponseType = {
  cursor: string;
  markets: Market[];
};