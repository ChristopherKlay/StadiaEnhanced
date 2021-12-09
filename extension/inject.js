/**
 * Injects scripts to the "main world", so they can be accessed from the webpage. In addition, they are also available
 * to all content scripts.
 *
 * As described in https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions,
 * this is the only ManifestV3-compatible method at the moment. The js file must be exposed in web_accessible_resources.
 */
inject('translations/ca.js')
inject('translations/da.js')
inject('translations/de.js')
inject('translations/en.js')
inject('translations/eo.js')
inject('translations/es.js')
inject('translations/fr.js')
inject('translations/hu.js')
inject('translations/it.js')
inject('translations/nl.js')
inject('translations/pt.js')
inject('translations/ru.js')
inject('translations/sk.js')
inject('translations/sv.js')

inject('main_world_scripts/collect_stream_info.js')
inject('main_world_scripts/set_resolution.js')
inject('main_world_scripts/log_translations.js')
inject('main_world_scripts/debug_enhanced.js')

function inject(filename) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(filename);
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}
