const getPreview = (html: string, css: string) => {
  const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `;

  const blob = new Blob([htmlContent], {
    type: "text/html",
  });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
};

export default getPreview;
