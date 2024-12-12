import { useEffect, useState } from "react";
import { getCookie, hasCookie, setCookie } from 'cookies-next';

/**
 * List of supported languages for translation.
 * Each language has a label and a value representing the translation path.
 */
const languages = [
  { label: 'English', value: '/auto/en' },
  { label: 'Русский', value: '/auto/ru' },
  { label: 'Polski', value: '/auto/pl' },
  { label: 'Español', value: '/auto/es' },
  { label: 'Français', value: '/auto/fr' },
  { label: 'Deutsch', value: '/auto/de' },
  { label: 'Italiano', value: '/auto/it' },
  { label: 'Português', value: '/auto/pt' },
  { label: '中文 (简体)', value: '/auto/zh-CN' },
  { label: '中文 (繁體)', value: '/auto/zh-TW' },
  { label: '日本語', value: '/auto/ja' },
  { label: '한국어', value: '/auto/ko' },
  { label: 'العربية', value: '/auto/ar' },
  { label: 'বাংলা', value: '/auto/bn' },
  { label: 'ไทย', value: '/auto/th' },
  { label: 'Tiếng Việt', value: '/auto/vi' },
  { label: 'Türkçe', value: '/auto/tr' },
  { label: 'Українська', value: '/auto/uk' },
  { label: 'Nederlands', value: '/auto/nl' },
  { label: 'Svenska', value: '/auto/sv' },
  { label: 'Norsk', value: '/auto/no' },
  { label: 'Dansk', value: '/auto/da' },
  { label: 'Suomi', value: '/auto/fi' },
  { label: 'Čeština', value: '/auto/cs' },
  { label: 'Magyar', value: '/auto/hu' },
];

/**
 * GoogleTranslate component that provides a language selection dropdown
 * and sets the selected language in a cookie.
 * 
 * @returns {JSX.Element} - The rendered GoogleTranslate component.
 */
const GoogleTranslate = () => {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;

    if (hasCookie('googtrans')) {
      setSelected(getCookie('googtrans'));
    } else {
      setSelected('/auto/en');
    }
  }, []);

  /**
   * Handles the change event for the language selection dropdown.
   * Sets the selected language in the state and in a cookie.
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event object.
   */
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({
      pageLanguage: 'auto',
      autoDisplay: false,
      includedLanguages: "ru,en,pl,es,fr,de,it,pt,zh-CN,zh-TW,ja,ko,ar,bn,th,vi,tr,uk,nl,sv,no,da,fi,cs,hu",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  };

  const langChange = (e) => {
    const value = e.target.value;
    if (hasCookie('googtrans')) {
      setCookie('googtrans', decodeURI(value));
      setSelected(value);
    } else {
      setCookie('googtrans', value);
      setSelected(value);
    }
    window.location.reload();
  };

  return (
    <>
      <select
        value={selected}
        onChange={langChange}
        style={{ width: 100, display: 'inline-block' }}
        className={'notranslate'}
      >
        {languages.map(lang => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default GoogleTranslate;