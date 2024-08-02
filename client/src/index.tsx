import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AudioProvider, GradientProvider } from "./@contexts";

const queryClient = new QueryClient();

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AudioProvider>
          <GradientProvider>
              <App/>
            <ReactQueryDevtools initialIsOpen={false} />
          </GradientProvider>
        </AudioProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
