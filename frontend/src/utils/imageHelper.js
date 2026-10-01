// Universal SVG fallback avatar - Zero external network calls, 100% offline-proof
export const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='24' fill='%231e293b'/%3E%3Ccircle cx='60' cy='46' r='24' fill='%23f59e0b' opacity='0.9'/%3E%3Cpath d='M24 104 C24 82 40 76 60 76 C80 76 96 82 96 104' fill='%23f59e0b' opacity='0.9'/%3E%3C/svg%3E";

/**
 * Safe image error handler that prevents infinite error loops in React.
 * Setting `e.target.onerror = null` stops Chrome from endlessly re-triggering onError.
 */
export const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = DEFAULT_AVATAR;
};
