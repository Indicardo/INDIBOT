import type i18n from "i18n";

/**
 * Locale Service
 */
export class LocaleService {
  i18nProvider: typeof i18n;

  /**
   *
   * @param {typeof i18n} i18nProvider The i18n provider
   */
  constructor(i18nProvider: typeof i18n) {
    this.i18nProvider = i18nProvider;
    this.i18nProvider.configure({
      logErrorFn: function (msg) {
        this.client.logger.error(msg);
      },
    });
  }

  /**
   *
   * @returns {string} The current locale code
   */
  getCurrentLocale(): string {
    return this.i18nProvider.getLocale();
  }

  /**
   *
   * @returns string[] The list of available locale codes
   */
  getLocales() {
    return this.i18nProvider.getLocales();
  }

  /**
   * Globally sets a locale for future translate calls
   *
   * @param {string} locale The locale to set. Must be from the list of available locales.
   */
  setLocale(locale: string) {
    if (this.getLocales().indexOf(locale) !== -1) {
      this.i18nProvider.setLocale(locale);
    }
  }

  /**
   * Translates a provided string
   *
   * @param {string} phrase String to translate
   * @param {string} locale Locale to translate to
   * @param {string} namespace Namespace where each locale's translations are
   * @param {any} [replace] Optional string or object
   * @returns {string} Translated string
   */
  translate(
    phrase: string,
    locale: string,
    namespace: string,
    replace?: any
  ): string {
    return this.i18nProvider.__({ phrase, locale }, replace, namespace);
  }

  /**
   * Translates a provided string that has plural forms
   *
   * @param {any} phrase Object to translate
   * @param {number} count The plural number
   * @returns {string} Translated string
   */
  translatePlurals(phrase: any, count: number): string {
    return this.i18nProvider.__n(phrase, count);
  }
}
