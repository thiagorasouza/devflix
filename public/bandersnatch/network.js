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
}
