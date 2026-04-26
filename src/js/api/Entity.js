import createRequest from './createRequest';

export default class Entity {
  constructor(serverUrl, path) {
    this.serverUrl = serverUrl;
    this.path = path;
  }

  getUrl(id = '') {
    const url = `${this.serverUrl}${this.path}`;

    return id ? `${url}/${id}` : url;
  }

  list() {
    return createRequest({
      url: this.getUrl(),
      method: 'GET',
    });
  }

  get(id) {
    return createRequest({
      url: this.getUrl(id),
      method: 'GET',
    });
  }

  create(data) {
    return createRequest({
      url: this.getUrl(),
      method: 'POST',
      data,
    });
  }

  update(id, data) {
    return createRequest({
      url: this.getUrl(id),
      method: 'PUT',
      data,
    });
  }

  delete(id) {
    return createRequest({
      url: this.getUrl(id),
      method: 'DELETE',
    });
  }
}
