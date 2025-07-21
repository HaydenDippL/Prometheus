import { createContext, useContext, useState } from 'react';
import type { Market, KalshiMarketsResponseType } from '../types/Markets';

export type GetMarketsParams = {
    num_markets?: number; // Optional, default is 1000
    max_close_ts?: number;
    min_close_ts?: number;
}

type MarketsContextType = {
    markets: Market[];
    loading: boolean;
    getMarkets: (params: GetMarketsParams) => Promise<void>;
};


const MarketsContext = createContext<MarketsContextType | undefined>(undefined);

export const useMarkets = () => {
    const context = useContext(MarketsContext);
    if (!context) {
        throw new Error('useMarkets must be used within a MarketsProvider');
    }
    return context;
}

export const MarketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getMarkets = async (params: GetMarketsParams): Promise<void> => {
        setLoading(true);

        let total_markets = params.num_markets || 1000;
        let num_markets_fetched = 0;
        let markets_fetched: Market[] = [];
        let cursor: string | undefined = "";
        while (num_markets_fetched < total_markets) {
            const num_markets_to_fetch = Math.min(1000, total_markets - num_markets_fetched);
            let data: KalshiMarketsResponseType | undefined;

            try {
                const kalshi_markets_endpoint: string = `${import.meta.env.VITE_API_URL}/kalshi/trade-api/v2/markets`;
                let kalshi_markets_query_parameters: string[] = [];
                kalshi_markets_query_parameters.push(`limit=${num_markets_to_fetch}`);
                kalshi_markets_query_parameters.push(`status=open`);
                if (cursor) kalshi_markets_query_parameters.push(`cursor=${cursor}`);
                if (params.max_close_ts) kalshi_markets_query_parameters.push(`max_close_ts=${params.max_close_ts}`);
                if (params.min_close_ts) kalshi_markets_query_parameters.push(`min_close_ts=${params.min_close_ts}`);

                const kalshi_markets_url: string = `${kalshi_markets_endpoint}?${kalshi_markets_query_parameters.join('&')}`;

                const response = await fetch(kalshi_markets_url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                data = await response.json();

            } catch (error) {
                console.error('Failed to fetch markets:', error);
                setLoading(false);
                setMarkets([]);
                return;
            }

            if (!data) {
                console.error('No data received from API');
                setLoading(false);
                setMarkets([]);
                return;
            }

            markets_fetched = markets_fetched.concat(data.markets);
            cursor = data.cursor;
            if (data.markets.length < num_markets_to_fetch) {
                break;
            } else {
                num_markets_fetched += data.markets.length;
            }
        }

        setMarkets(markets_fetched);
        setLoading(false)
    };

    const value: MarketsContextType = {
        loading,
        markets,
        getMarkets,
    };

    return (
        <MarketsContext.Provider value={value}>
            {children}
        </MarketsContext.Provider>
    );
};