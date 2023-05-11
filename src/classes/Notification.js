class Notification {
  constructor(json) {
    if (!json) throw new Error('The message JSON was undefined.');
    if (typeof json !== 'object') {
      json = JSON.parse(json);
    }
    this.read = json.read;
    this.time = new Date(json.time);
  }
  changeReadStatus(status) {
    if (status) {
      if (typeof status !== 'boolean')
        throw new Error('The read status must be a boolean.');
      this.read = status;
    }
    this.read = !this.read;
  }
  delete() {
    throw new Error('Notification.delete() is an unimplemented method.');
  }
}

export default Notification;
