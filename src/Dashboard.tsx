import { useEffect, useMemo, useState } from "react";
import { useMarkets } from "./hooks/Markets";
import type { Market } from "./types/Markets";
import type { GetMarketsParams } from "./hooks/Markets";

import { AgGridReact } from "ag-grid-react";
import type { ColDef, ValueGetterParams } from "ag-grid-community";

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// CRITICAL: Import ag-grid CSS - without these, the grid won't appear
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css'; // or ag-theme-alpine, ag-theme-balham

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export function Dashboard() {
    const { markets, getMarkets, loading } = useMarkets();

    useEffect(() => {
        if (markets.length > 0) {
            return;
        }

        const fetchData = async () => {
            try {
                const params: GetMarketsParams = {
                    num_markets: 100, // Fetch up to 100 markets
                };
                await getMarkets(params);
            } catch (error) {
                console.error('Error fetching markets:', error);
            }
        };

        fetchData();
    }, []);

    const columnDefs: ColDef<Market>[] = useMemo(() => [
        { field: "title", headerName: "Title", flex: 2 },
        { field: "subtitle", headerName: "Subtitle", flex: 1 },
        {
            headerName: "YES Spread",
            valueGetter: (params: ValueGetterParams<Market>) =>
                params.data ? (params.data.yes_ask - params.data.yes_bid).toFixed(2) : "",
            sortable: true,
            filter: true,
            width: 120,
        },
        {
            headerName: "NO Spread",
            valueGetter: (params: ValueGetterParams<Market>) =>
                params.data ? (params.data.no_ask - params.data.no_bid).toFixed(2) : "",
            sortable: true,
            filter: true,
            width: 120,
        },
        { field: "yes_bid", headerName: "YES Bid", sortable: true, filter: true, width: 100 },
        { field: "yes_ask", headerName: "YES Ask", sortable: true, filter: true, width: 100 },
        { field: "no_bid", headerName: "NO Bid", sortable: true, filter: true, width: 100 },
        { field: "no_ask", headerName: "NO Ask", sortable: true, filter: true, width: 100 },
        { field: "liquidity", headerName: "Liquidity", sortable: true, filter: true, width: 120 },
        { field: "volume", headerName: "Volume", sortable: true, filter: true, width: 100 },
        { field: "volume_24h", headerName: "Volume 24h", sortable: true, filter: true, width: 120 },
    ], []);

    const defaultColDef: ColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
    }), []);

    // Debug: Check if data is loading
    console.log('Markets data:', markets);
    console.log('Markets length:', markets.length);

    if (loading) {
        return <div>Loading markets...</div>;
    }

    if (!markets.length) {
        return <div>No markets data available.</div>;
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <h1>Kalshi Markets Dashboard</h1>
            <div 
                className="ag-theme-quartz" // This className is CRITICAL
                style={{ height: 'calc(100vh - 60px)', width: '100%' }}
            >
                <AgGridReact
                    rowData={markets}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={50}
                />
            </div>
        </div>
    );
}