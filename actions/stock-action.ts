"use server";

import axios from "axios";

export type Ticker = (typeof TICKERS)[number];

export interface StockBar {
  name: Ticker;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
  trades: number | null;
  timestamp: number;
  date: string;
}

export type StocksData = Record<Ticker, StockBar>;

const TICKERS = ["AAPL", "TSLA", "META", "NVDA", "MSFT"] as const;

const dummyStocks: StocksData = {
  AAPL: {
    name: "AAPL",
    open: 188.5,
    high: 191.2,
    low: 187.1,
    close: 190.42,
    volume: 52896500,
    vwap: 189.78,
    trades: 412583,
    timestamp: 1731978000000,
    date: "2025-11-18",
  },
  TSLA: {
    name: "TSLA",
    open: 332.8,
    high: 349.9,
    low: 330.1,
    close: 322.55,
    volume: 148723100,
    vwap: 341.22,
    trades: 892104,
    timestamp: 1731978000000,
    date: "2025-11-18",
  },
  META: {
    name: "META",
    open: 508.7,
    high: 518.4,
    low: 505.3,
    close: 512.33,
    volume: 22184500,
    vwap: 511.89,
    trades: 198765,
    timestamp: 1731978000000,
    date: "2025-11-18",
  },
  NVDA: {
    name: "NVDA",
    open: 134.8,
    high: 138.65,
    low: 133.2,
    close: 137.42,
    volume: 385421300,
    vwap: 136.88,
    trades: 1245872,
    timestamp: 1731978000000,
    date: "2025-11-18",
  },
  MSFT: {
    name: "MSFT",
    open: 418.2,
    high: 423.9,
    low: 416.55,
    close: 422.1,
    volume: 28763400,
    vwap: 420.95,
    trades: 215493,
    timestamp: 1731978000000,
    date: "2025-11-18",
  },
};

let cachedStocks: { data: StocksData; forDate: string } | null = null;

async function fetchSingleStock(ticker: string) {
  const apiKey = process.env.STOCK_API;
  if (!apiKey) throw new Error("STOCK_API key not set");

  const date = new Date();
  date.setDate(date.getDate() - 1);
  const dateStr = date.toISOString().split("T")[0];

  const url = `https://api.massive.com/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${dateStr}/${dateStr}?adjusted=true&apikey=${apiKey}`;

  try {
    const { data } = await axios.get(url);
    if (!data.results || data.results.length === 0) {
      console.warn(`No data for ${ticker} on ${dateStr}`);
      return null;
    }

    const bar = data.results[0];
    return {
      name: ticker,
      open: Number(bar.o),
      high: Number(bar.h),
      low: Number(bar.l),
      close: Number(bar.c),
      volume: Number(bar.v),
      vwap: Number(bar.vwap ?? bar.vw),
      trades: bar.n ?? null,
      timestamp: bar.t,
      date: dateStr,
    } as StockBar;
  } catch (err) {
    console.error(
      `Failed to fetch ${ticker}:`,
      err.response?.data || err.message,
    );
    return null;
  }
}

export async function getStocks() {
  if (process.env.NODE_ENV === "development") return dummyStocks;

  const date = new Date();
  date.setDate(date.getDate() - 1);
  const targetDateStr = date.toISOString().split("T")[0];

  if (cachedStocks && cachedStocks.forDate === targetDateStr) {
    return cachedStocks.data;
  }

  const results = await Promise.all(
    TICKERS.map((ticker) => fetchSingleStock(ticker)),
  );

  const stockData: StocksData = { ...dummyStocks };
  TICKERS.forEach((ticker, index) => {
    const fetched = results[index];
    if (fetched) stockData[ticker] = fetched;
  });

  cachedStocks = { data: stockData, forDate: targetDateStr };

  return stockData;
}
