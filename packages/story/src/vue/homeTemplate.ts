const homeTemplate = (
  componentPath: string,
  mockData: {
    name: string;
    data: Record<string, unknown>;
  }[],
) => {
  return `
    import { createApp } from 'vue';
    import Component from '${componentPath}';
    
    const app = createApp(Component, {
      ${Object.entries(mockData[0].data)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(",\n        ")}
    });
    app.mount('#app');`;
};

export default homeTemplate;
