const defaultBubbleHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M172 108a12 12 0 0 1-12 12H96a12 12 0 0 1 0-24h64a12 12 0 0 1 12 12m-12 28H96a12 12 0 0 0 0 24h64a12 12 0 0 0 0-24m76-8a108 108 0 0 1-157.23 96.15L46.34 235A20 20 0 0 1 21 209.66l10.81-32.43A108 108 0 1 1 236 128m-24 0a84 84 0 1 0-156.73 42.06a12 12 0 0 1 1 9.81l-9.93 29.79l29.79-9.93a12.1 12.1 0 0 1 3.8-.62a12 12 0 0 1 6 1.62A84 84 0 0 0 212 128"/></svg>`;
const openBubbleHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"/></svg>`;
const defaultSrc = '/chatbot';

const buttonStyle = {
  position: "fixed",
  right: "30px",
  bottom: "30px",
  padding: "15px",
  borderRadius: "100%",
  cursor: "pointer",
  background: "#0369a1",
  boxShadow: "rgba(0,0,0,0.5) 2px 8px 5px 0px",
  color: "#FFFFFF",
};

const iframeStyle = {
  position: "fixed",
  bottom: "100px",
  right: "20px",
  width: "413px",
  height: "680px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  display: "none",
};

let openChat = false;

export function initBubble({iframeSrc = defaultSrc, buttonHtml = defaultBubbleHtml, openHtml = openBubbleHtml} = {}) {
  const button = document.createElement("button");
  button.innerHTML = buttonHtml
  Object.assign(button.style, buttonStyle );
  document.body.appendChild(button);

  const iframe = document.createElement("iframe");
  iframe.src = iframeSrc;
  Object.assign(iframe.style, iframeStyle);
  document.body.appendChild(iframe);

  button.addEventListener("click", function() {
      openChat = !openChat;
      console.log(openChat);
      iframe.style.display = iframe.style.display === "none" ? "block" : "none";
      button.innerHTML = (!openChat) ? buttonHtml : openHtml;
  });
}
