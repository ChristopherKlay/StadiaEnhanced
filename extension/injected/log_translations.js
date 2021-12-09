/**
 * Translation Logs
 * 
 * Provide the enhanced_logTranslations function on a "main world" level so it can be used in the debug utility.
 * This is separate from the loadTranslations function used by the actual extension.
 */
function enhanced_logTranslations() {
    console.groupCollapsed('Stadia Enhanced: Translation Output')

    for (let language of ['fr', 'nl', 'sv', 'pt', 'ca', 'da', 'it', 'es', 'de', 'ru', 'hu', 'sk', 'eo']) {
        _logTranslations(language)
    }

    console.groupEnd()

    function _logTranslations(lang) {
        const startedAt = window.performance.now()

        // Load english translations by default
        let result = _getTranslationByLang("en")

        // Load translation for user's language
        const languageTranslation = _getTranslationByLang(lang)

        // Merge fix entries (this substitutes missing keys with english)
        let keySubstitutionCount = 0
        const keysMissing = []

        Object.entries(result).forEach(([key]) => {
            if (languageTranslation.hasOwnProperty(key)) { // Language-entry exists, overwrite the english text
                if (languageTranslation[key] != undefined) {
                    result[key] = languageTranslation[key]
                } else {
                    keySubstitutionCount++ // Key doesn't exist in language, keep english translation
                }
            } else {
                keysMissing.push(key)
            }
        });

        const loadingDuration = window.performance.now() - startedAt
        let keySize = Object.keys(languageTranslation).length;
        let missingKeySize = Object.keys(keysMissing).length;

        console.groupCollapsed(
            `%cStadia Enhanced%c ⚙️ - Loading translation "${lang}" - ${keySize} keys in ${loadingDuration.toFixed(2)} ms, ${keySubstitutionCount} key(s) defaulting to "en" and ${missingKeySize} key(s) missing.`,
            'background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;',
            ''
        )
        console.table(languageTranslation)

        if (missingKeySize !== 0) {
            console.table(keysMissing)
        }

        console.groupEnd()
    }

    function _getTranslationByLang(lang) {
        switch (lang) {
            case 'ca':
                return TRANSLATION_CA
            case 'da':
                return TRANSLATION_DA
            case 'de':
                return TRANSLATION_DE
            case 'eo':
                return TRANSLATION_EO
            case 'es':
                return TRANSLATION_ES
            case 'fr':
                return TRANSLATION_FR
            case 'hu':
                return TRANSLATION_HU
            case 'it':
                return TRANSLATION_IT
            case 'nl':
                return TRANSLATION_NL
            case 'pt':
                return TRANSLATION_PT
            case 'ru':
                return TRANSLATION_RU
            case 'sk':
                return TRANSLATION_SK
            case 'sv':
                return TRANSLATION_SV
            default:
                return TRANSLATION_EN
        }
    }
}