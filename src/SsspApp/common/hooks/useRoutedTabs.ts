import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type UseRoutedTabsOptions<TTab extends string> = {
  segmentIndex: number;
  enabled?: boolean;
  defaultTab?: TTab;

  /**
   * When true, switching to a tab navigates back to the last visited full path
   * under that tab (including search/hash), if available.
   */
  rememberLastPath?: boolean;

  /**
   * When true, drop all path segments after segmentIndex when navigating.
   * Useful for top-level tabs so we don’t carry deeper sub-routes across tabs.
   */
  resetAfterIndex?: boolean;
};

const normalizePathname = (pathname: string) => {
  if (!pathname) return "/";
  const collapsed = pathname.replace(/\/+/g, "/");
  return collapsed.startsWith("/") ? collapsed : `/${collapsed}`;
};

const getSegments = (pathname: string) =>
  normalizePathname(pathname).split("/");

const buildPathWithSegment = (
  pathname: string,
  segmentIndex: number,
  segmentValue: string,
  resetAfterIndex: boolean
) => {
  const segments = getSegments(pathname);
  while (segments.length <= segmentIndex) segments.push("");

  segments[segmentIndex] = segmentValue;

  const nextSegments = resetAfterIndex
    ? segments.slice(0, segmentIndex + 1)
    : segments;

  let nextPath = nextSegments.join("/");
  nextPath = normalizePathname(nextPath);

  // Avoid trailing slash except root
  if (nextPath.length > 1) nextPath = nextPath.replace(/\/+$/, "");

  return nextPath;
};

const useRoutedTabs = <TTab extends string>(
  tabs: Record<TTab, string>,
  options: UseRoutedTabsOptions<TTab>
) => {
  const navigate = useNavigate();
  const location = useLocation();

  const enabled = options.enabled ?? true;
  const defaultTab = useMemo(
    () => options.defaultTab ?? (Object.keys(tabs)[0] as TTab),
    [options.defaultTab, tabs]
  );

  const isValidTabKey = useCallback(
    (tab: string): tab is TTab => tab in tabs,
    [tabs]
  );

  const getTabFromPathname = useCallback(
    (pathname: string): TTab => {
      const segments = getSegments(pathname);
      const fromPath = segments[options.segmentIndex] || "";
      return fromPath && isValidTabKey(fromPath) ? fromPath : defaultTab;
    },
    [defaultTab, isValidTabKey, options.segmentIndex]
  );

  const [activeTab, setActiveTab] = useState<TTab>(() =>
    getTabFromPathname(location.pathname)
  );

  const lastPaths = useRef({} as Record<string, string>);

  useEffect(() => {
    if (!enabled) return;

    const normalizedTab = getTabFromPathname(location.pathname);

    // Track the last fully-qualified path per tab (optional)
    if (options.rememberLastPath) {
      const currentTabFromPath = getSegments(location.pathname)[
        options.segmentIndex
      ];
      if (currentTabFromPath && isValidTabKey(currentTabFromPath)) {
        lastPaths.current[currentTabFromPath] =
          location.pathname + location.search + location.hash;
      }
    }

    const segments = getSegments(location.pathname);
    const tabSegment = segments[options.segmentIndex] || "";

    // Normalize missing/invalid tab segment to default
    if (!tabSegment || !isValidTabKey(tabSegment)) {
      const targetPathname = buildPathWithSegment(
        location.pathname,
        options.segmentIndex,
        normalizedTab,
        options.resetAfterIndex ?? false
      );

      navigate(
        {
          pathname: targetPathname,
          search: location.search,
          hash: location.hash,
        },
        { replace: true }
      );
      return;
    }

    setActiveTab(normalizedTab);
  }, [
    enabled,
    getTabFromPathname,
    isValidTabKey,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    options.rememberLastPath,
    options.resetAfterIndex,
    options.segmentIndex,
  ]);

  const selectTab = useCallback(
    (tab: string | null) => {
      if (!enabled || !tab) return;
      if (!isValidTabKey(tab)) return;

      if (tab === activeTab) return;

      const remembered = options.rememberLastPath
        ? lastPaths.current[tab]
        : undefined;

      if (remembered) {
        navigate(remembered);
        return;
      }

      const targetPathname = buildPathWithSegment(
        location.pathname,
        options.segmentIndex,
        tab,
        options.resetAfterIndex ?? false
      );

      navigate(
        {
          pathname: targetPathname,
          search: location.search,
          hash: location.hash,
        },
        { replace: false }
      );
    },
    [
      activeTab,
      enabled,
      isValidTabKey,
      location.hash,
      location.pathname,
      location.search,
      navigate,
      options.rememberLastPath,
      options.resetAfterIndex,
      options.segmentIndex,
    ]
  );

  return { activeTab, defaultTab, selectTab };
};

export default useRoutedTabs;
