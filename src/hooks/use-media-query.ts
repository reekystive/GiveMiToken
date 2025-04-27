import { useEffect, useMemo, useState } from 'react';

export const useMediaQuery = (query: string) => {
  const mediaQuery = useMemo(() => window.matchMedia(query), [query]);
  const [state, setState] = useState(mediaQuery.matches);

  useEffect(() => {
    const handleChange = () => {
      setState(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mediaQuery]);

  return state;
};
