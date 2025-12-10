 'use client'

import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import PageHeader from "../PageHeader/PageHeader";
import Loader from "../Loader/Loader";

interface LayoutWrapperProps {
  navbar: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

export default function LayoutWrapper({ navbar, sidebar, children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  // Loader timing configuration (milliseconds)
  const INITIAL_HIDE_DELAY = 600; // delay after readyState complete before hiding loader
  const MAX_INITIAL_LOADER = 3000; // maximum time to show initial loader
  const [navLoading, setNavLoading] = useState(false);

  // Check if we're on the home page - only match exact root path
  const isHomePage = pathname === "/";

  // Show sidebar and page header on all pages except home
  const showSidebar = !isHomePage;

  // Toggle the ready class on mount and whenever the pathname or loading state changes
  // Wait for the initial loader to finish before showing the ready animation so home animates
  useEffect(() => {
    setReady(false);
    // If the initial loader is still visible, wait until it's hidden
    if (loading) return;
    const t = setTimeout(() => setReady(true), 20);
    return () => clearTimeout(t);
  }, [pathname, loading]);

  // Show a brief loader on first client mount; hide when window 'load' fires or after a timeout
  useEffect(() => {
    let didUnmount = false;
    const hide = () => {
      if (didUnmount) return;
      setLoading(false);
    };

    if (typeof window !== 'undefined') {
      // If the page already loaded, hide immediately after a short pause
      if (document.readyState === 'complete') {
        const t = setTimeout(hide, INITIAL_HIDE_DELAY);
        return () => { clearTimeout(t); didUnmount = true };
      }

      window.addEventListener('load', hide, { once: true });
      const max = setTimeout(hide, MAX_INITIAL_LOADER);
      return () => { window.removeEventListener('load', hide); clearTimeout(max); didUnmount = true };
    }

    return () => { didUnmount = true };
  }, []);

  // Show loader during client-side navigations (app-router). Debounce to avoid flicker.
  // NOTE: useNavigation is not available in next/navigation, so this effect is disabled.
  // If you want to handle navigation loading, use router events or another supported method.
  // useEffect(() => {
  //   let t: ReturnType<typeof setTimeout> | null = null;
  //   if (navigation?.state === 'loading') {
  //     t = setTimeout(() => setNavLoading(true), NAV_DEBOUNCE);
  //   } else {
  //     if (t) clearTimeout(t);
  //     setNavLoading(false);
  //   }
  //   return () => { if (t) clearTimeout(t); };
  // }, [navigation?.state]);

  // If you want to show a loader during client-side navigations, 
  // you may need to implement a custom solution or use a different hook,
  // as 'useNavigation' is not available in 'next/navigation'.
  return (
    <div className="flex flex-col w-full min-h-screen">
      {loading && <Loader />}
      {/* Navbar on home page */}
      {isHomePage && <div className="sticky top-0 z-50 bg-background border-b">{navbar}</div>}
      
      {/* For non-home pages: show sidebar with header */}
      {showSidebar && (
        <>
          <PageHeader />
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-shrink-0 overflow-y-auto">{sidebar}</div>
            <main className="flex-1 overflow-y-auto overflow-x-hidden w-full bg-background">
              <div className={`w-full p-4 sm:p-6 md:p-8 page-fade ${ready ? 'ready' : ''}`}>
                {children}
              </div>
            </main>
          </div>
        </>
      )}
      
      {/* For home page: full-width content */}
      {isHomePage && (
        <div className={`flex-1 w-full bg-background page-fade ${ready ? 'ready' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
}
