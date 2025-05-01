"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { Provider } from 'react-redux';
import store from '@/store/Store'; 

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SidebarProvider>
        <Provider store={store}>
              {children}
        </Provider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
