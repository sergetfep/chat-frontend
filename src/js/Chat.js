import ChatAPI from './api/ChatAPI';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
    this.user = null;
    this.elements = {};
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
  }

  bindToDOM() {
    this.container.innerHTML = `
      <div class="container">
        <h1 class="chat__header">Chat</h1>
        <div class="chat__container hidden">
          <div class="chat__area">
            <div class="chat__messages-container"></div>
            <div class="chat__messages-input">
              <form class="form chat__message-form">
                <input class="form__input chat__message-field" type="text" placeholder="Type your message here">
              </form>
            </div>
          </div>
          <div class="chat__userlist"></div>
        </div>
      </div>
      <div class="modal__form active">
        <div class="modal__background"></div>
        <div class="modal__content">
          <div class="modal__header">Choose nickname</div>
          <form class="form modal__body nickname-form">
            <div class="form__group">
              <label class="form__label" for="nickname">Nickname</label>
              <input class="form__input nickname-field" id="nickname" name="nickname" type="text" autocomplete="off" required>
              <div class="form__hint hidden"></div>
            </div>
          </form>
          <div class="modal__footer">
            <button class="modal__ok" type="button">Continue</button>
          </div>
        </div>
      </div>
    `;

    this.elements.chat = this.container.querySelector('.chat__container');
    this.elements.modal = this.container.querySelector('.modal__form');
    this.elements.nicknameForm = this.container.querySelector('.nickname-form');
    this.elements.nicknameField =
      this.container.querySelector('.nickname-field');
    this.elements.nicknameButton = this.container.querySelector('.modal__ok');
    this.elements.hint = this.container.querySelector('.form__hint');
    this.elements.messageForm = this.container.querySelector(
      '.chat__message-form',
    );
    this.elements.messageField = this.container.querySelector(
      '.chat__message-field',
    );
    this.elements.messages = this.container.querySelector(
      '.chat__messages-container',
    );
    this.elements.userList = this.container.querySelector('.chat__userlist');
  }

  registerEvents() {
    this.elements.nicknameButton.addEventListener('click', () =>
      this.onEnterChatHandler(),
    );

    this.elements.nicknameForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onEnterChatHandler();
    });

    this.elements.messageForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.sendMessage();
    });

    window.addEventListener('pagehide', () => this.leaveChat());
  }

  subscribeOnEvents() {
    this.websocket = new WebSocket(this.api.getWebSocketUrl());

    this.websocket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        this.renderUsers(data);
        return;
      }

      if (data.type === 'send') {
        this.renderMessage(data);
      }
    });

    this.websocket.addEventListener('close', () => {
      this.websocket = null;
    });
  }

  async onEnterChatHandler() {
    const name = this.elements.nicknameField.value.trim();

    if (!name) {
      this.showHint('Введите никнейм');
      return;
    }

    try {
      const result = await this.api.addUser(name);
      this.user = result.user;
      this.elements.modal.classList.remove('active');
      this.elements.chat.classList.remove('hidden');
      this.elements.messageField.focus();
      this.subscribeOnEvents();
    } catch (error) {
      this.showHint(error.message || 'Никнейм занят, выберите другой');
    }
  }

  sendMessage() {
    const text = this.elements.messageField.value.trim();

    if (
      !text ||
      !this.websocket ||
      this.websocket.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    this.websocket.send(
      JSON.stringify({
        type: 'send',
        message: text,
        user: this.user,
      }),
    );

    this.elements.messageField.value = '';
  }

  leaveChat() {
    if (
      !this.user ||
      !this.websocket ||
      this.websocket.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    this.websocket.send(
      JSON.stringify({
        type: 'exit',
        user: this.user,
      }),
    );
  }

  renderUsers(users) {
    this.elements.userList.innerHTML = '';

    users.forEach((user) => {
      const item = document.createElement('div');
      item.className = 'chat__user';

      if (this.user && user.id === this.user.id) {
        item.classList.add('chat__user-yourself');
      }

      item.textContent = user.name;
      this.elements.userList.appendChild(item);
    });
  }

  renderMessage(data) {
    const isYourMessage = this.user && data.user.id === this.user.id;
    const message = document.createElement('div');
    const header = document.createElement('div');
    const text = document.createElement('p');

    message.className = 'message__container';
    message.classList.add(
      isYourMessage
        ? 'message__container-yourself'
        : 'message__container-interlocutor',
    );

    header.className = 'message__header';
    header.textContent = `${
      isYourMessage ? 'You' : data.user.name
    }, ${this.getMessageTime()}`;

    text.className = 'message__text';
    text.textContent = data.message;

    message.appendChild(header);
    message.appendChild(text);
    this.elements.messages.appendChild(message);
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
  }

  getMessageTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }

  showHint(text) {
    this.elements.hint.textContent = text;
    this.elements.hint.classList.remove('hidden');
  }
}
