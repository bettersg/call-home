import { useCallback, useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'lang';

export type LanguageOption = 'en';

export function useLanguage(): [
  LanguageOption,
  (lang: LanguageOption) => void
] {
  const [lang, setLangInternal] = useState<LanguageOption>('en');

  useEffect(() => {
    const localStorageLang = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localStorageLang) {
      setLangInternal(localStorageLang as LanguageOption);
    }
  }, []);

  const setLang = useCallback(
    (newLang: LanguageOption) => {
      setLangInternal(newLang);
      localStorage.setItem(LOCAL_STORAGE_KEY, newLang);
    },
    [setLangInternal]
  );

  return [lang, setLang];
}
