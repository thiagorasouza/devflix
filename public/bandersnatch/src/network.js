class Network {
  constructor({ host }) {
    this.host = host;
  }

  parseFileURL({ url, hostTag, fileResolutionTag, fileResolution }) {
    return url
      .replace(hostTag, this.host)
      .replace(fileResolutionTag, fileResolution);
  }

  async fetchFile(url) {
    const response = await fetch(url);
    return response.arrayBuffer();
  }

  async calculateResolution(url) {
    const start = Date.now();
    const file = await this.fetchFile(url);
    const end = Date.now();
    const timespan = end - start;
    console.log("🚀 ~ timespan", timespan);

    const resolutions = [
      { min: 0, max: 500, resolution: 720 },
      { min: 501, max: 2000, resolution: 360 },
      { min: 2001, max: 9999999, resolution: 144 },
    ];

    return resolutions.find((item) => timespan <= item.max).resolution || 144;
  }
}
