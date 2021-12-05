/**
 * Injects scripts to the "main world", so they can be accessed from the webpage. In addition, they are also available
 * to all content scripts.
 *
 * As described in https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions,
 * this is the only ManifestV3-compatible method at the moment. The js file must be exposed in web_accessible_resources.
 */

inject('main_world_scripts/collect_stream_info.js')
inject('main_world_scripts/set_resolution.js')
inject('main_world_scripts/debug_enhanced.js')

function inject(filename) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(filename);
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}
