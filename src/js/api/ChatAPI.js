import Entity from './Entity';

const DEFAULT_SERVER_URL = 'http://localhost:3000';

export default class ChatAPI extends Entity {
  constructor() {
    const serverUrl = (window.CHAT_BACKEND_URL || DEFAULT_SERVER_URL).replace(
      /\/$/,
      '',
    );

    super(serverUrl, '/new-user');
  }

  addUser(name) {
    return this.create({ name });
  }

  getWebSocketUrl() {
    return this.serverUrl.replace(/^http/, 'ws');
  }
}
