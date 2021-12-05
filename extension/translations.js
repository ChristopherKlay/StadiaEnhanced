// loads english translations by default,
// then replaces keys that are available in the user's browser language
function loadTranslations(lang) {
    let result = _getTranslationByLang("en")
    const languageTranslation = _getTranslationByLang(lang)

    // Overwrite default (english) entry if available in the specified language
    Object.entries(result).forEach(([key]) => {
        if (languageTranslation.hasOwnProperty(key) && languageTranslation[key] !== undefined) {
            result[key] = languageTranslation[key]
        }
    });

    let keySize = Object.keys(languageTranslation).length;
    console.log(
        `%cStadia Enhanced%c ⚙️ - Loading translation "${lang}" - ${keySize} keys.`,
        'background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;',
        ''
    )

    return result

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
