import Conf from 'conf';

const config = new Conf({
  projectName: 'ktmcp-amazonpinpoint',
  schema: {
    apiKey: {
      type: 'string',
      default: ''
    }
  }
});

export function getConfig(key) {
  return config.get(key);
}

export function setConfig(key, value) {
  config.set(key, value);
}

export function isConfigured() {
  return !!config.get('apiKey');
}

export default config;
