export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          email: string | null;
          password: string | null;
          connected_bank: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          email?: string | null;
          password?: string | null;
          connected_bank?: string | null;
          created_at?: string;
        };
        Update: {
          phone?: string;
          email?: string | null;
          password?: string | null;
          connected_bank?: string | null;
        };
      };
      conversation_history: {
        Row: {
          id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
      };
      investor_profiles: {
        Row: {
          id: string;
          user_id: string;
          experience: "none" | "basic" | "intermediate" | "advanced";
          goal: "short_term" | "inflation" | "growth" | "retirement" | "other";
          horizon: "less_1y" | "1_to_3y" | "more_3y";
          risk_tolerance: "conservative" | "moderate" | "aggressive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          experience: "none" | "basic" | "intermediate" | "advanced";
          goal: "short_term" | "inflation" | "growth" | "retirement" | "other";
          horizon: "less_1y" | "1_to_3y" | "more_3y";
          risk_tolerance: "conservative" | "moderate" | "aggressive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          experience?: "none" | "basic" | "intermediate" | "advanced";
          goal?: "short_term" | "inflation" | "growth" | "retirement" | "other";
          horizon?: "less_1y" | "1_to_3y" | "more_3y";
          risk_tolerance?: "conservative" | "moderate" | "aggressive";
          updated_at?: string;
        };
      };
      instruments: {
        Row: {
          id: string;
          name: string;
          ticker: string | null;
          category: "renta_fija" | "renta_variable" | "dolar" | "mixto" | "commodities";
          risk_level: "low" | "medium" | "high";
          return_1m: number;
          return_3m: number;
          return_1y: number;
          volatility: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          ticker?: string | null;
          category: "renta_fija" | "renta_variable" | "dolar" | "mixto" | "commodities";
          risk_level: "low" | "medium" | "high";
          return_1m: number;
          return_3m: number;
          return_1y: number;
          volatility: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          ticker?: string | null;
          category?: "renta_fija" | "renta_variable" | "dolar" | "mixto" | "commodities";
          risk_level?: "low" | "medium" | "high";
          return_1m?: number;
          return_3m?: number;
          return_1y?: number;
          volatility?: number;
          is_active?: boolean;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          fit_score: number | null;
          status: "draft" | "active" | "archived";
          is_suggested: boolean;
          contribution_amount: number | null;
          contribution_type: "percentage" | "fixed" | null;
          contribution_frequency: "weekly" | "biweekly" | "monthly" | null;
          next_contribution_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          fit_score?: number | null;
          status?: "draft" | "active" | "archived";
          is_suggested?: boolean;
          contribution_amount?: number | null;
          contribution_type?: "percentage" | "fixed" | null;
          contribution_frequency?: "weekly" | "biweekly" | "monthly" | null;
          next_contribution_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          fit_score?: number | null;
          status?: "draft" | "active" | "archived";
          is_suggested?: boolean;
          contribution_amount?: number | null;
          contribution_type?: "percentage" | "fixed" | null;
          contribution_frequency?: "weekly" | "biweekly" | "monthly" | null;
          next_contribution_date?: string | null;
          updated_at?: string;
        };
      };
      portfolio_instruments: {
        Row: {
          portfolio_id: string;
          instrument_id: string;
          percentage: number;
        };
        Insert: {
          portfolio_id: string;
          instrument_id: string;
          percentage: number;
        };
        Update: {
          percentage?: number;
        };
      };
      contribution_history: {
        Row: {
          id: string;
          portfolio_id: string;
          amount: number;
          executed_at: string;
          status: "simulated" | "pending";
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          amount: number;
          executed_at?: string;
          status?: "simulated" | "pending";
        };
        Update: {
          amount?: number;
          status?: "simulated" | "pending";
        };
      };
    };
  };
}

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type InvestorProfileRow = Database["public"]["Tables"]["investor_profiles"]["Row"];
export type InstrumentRow = Database["public"]["Tables"]["instruments"]["Row"];
export type PortfolioRow = Database["public"]["Tables"]["portfolios"]["Row"];
export type PortfolioInstrumentRow = Database["public"]["Tables"]["portfolio_instruments"]["Row"];
export type ContributionHistoryRow = Database["public"]["Tables"]["contribution_history"]["Row"];
export type ConversationHistoryRow = Database["public"]["Tables"]["conversation_history"]["Row"];
