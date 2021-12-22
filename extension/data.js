/**
 * Handles the retrieval of steaming data.
 */
class StreamDataService {
    _KEY = "enhanced_streamData"

    /**
     * @typedef {Object} Data - streaming info
     * @property {string} date - Date of the streaming recording
     * @property {string} time - Time of the streaming recording
     * @property {string} sessiontime - Duration of the current session in format "HH:MM:SS"
     * @property {string} codec - The video compression standard used. Can have the following values:
     *      - "Hardware H264":
     *          Older, most popular codec. Only supports resolutions up to 1080p.
     *      - "Hardware VP9":
     *          Codec from Google that was developed from technology acquired when Google purchased On2 Technologies in
     *          February 2010. Supports resolutions up to 4K. In Stadia, uses a higher bitrate than H264.
     *      - "Software VP9":
     *          See "Hardware VP9". When hardware doesn't support VP, you can force it anyway.
     * @property {string} resolution - Current browser resolution in width by height (e.g. "2560x1440")
     * @property {string} fps - Frames per second of the video stream (NOT the game itself)
     * @property {string} compression
     * @property {string} decode - Decoding time in ms
     * @property {string} framedrop - Number and percentage of frames dropped
     * @property {string} framedropPerc - Percentage of frames dropped (e.g. "0.000")
     * @property {string} sessionTraffic - e.g. "39.13 MB"
     * @property {string} currentTraffic - e.g. "424.21 Kb",
     * @property {string} averageTraffic - e.g. "1.94 GB/h",
     * @property {string} packetloss - Number and percentage of packets lost, e.g. "0 (0.000%)",
     * @property {number} latency - Latency in ms
     * @property {string} jitter - Jitter buffer (e.g. "28.70 ms")
     */

    /**
     * Returns streaming data obtained from analyzing RTCPeerConnection objects.
     *
     * @returns {Data|null} data
     */
    getData() {
        const json = localStorage.getItem(this._KEY);
        if (json == null) {
            return null;
        }
        return JSON.parse(json)
    }
}
