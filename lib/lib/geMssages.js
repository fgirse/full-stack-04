export async function getMessages(locale) {
    return import(`../messages/${locale}.json`).then((messages) => messages.default)
  }