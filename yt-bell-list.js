let enabled = false;

function hasAllNotifications(channel) {
  return [...channel.querySelectorAll("button[aria-label]")].some((button) =>
    button
      .getAttribute("aria-label")
      ?.includes("Current setting is all notifications."),
  );
}

function applyFilter() {
  document.querySelectorAll("ytd-channel-renderer").forEach((channel) => {
    channel.style.display = hasAllNotifications(channel) ? "" : "none";
  });
}

function clearFilter() {
  document.querySelectorAll("ytd-channel-renderer").forEach((channel) => {
    channel.style.display = "";
  });
}

function toggleFilter() {
  enabled = !enabled;

  if (enabled) {
    applyFilter();
    toggleButton.textContent = "Show all channels";
  } else {
    clearFilter();
    toggleButton.textContent = "Show bell channels";
  }
}

function insertButton() {
  const target = document.querySelector(
    "#header-container .ytd-section-list-renderer",
  );

  if (!target) {
    return false;
  }

  if (document.getElementById("yt-bell-button")) {
    target.style.display = "flex";
    return true;
  }

  const button = document.createElement("button");
  button.id = "yt-bell-button";

  button.textContent = "Bell channels";

  button.style.marginLeft = "12px";
  button.style.padding = "8px 12px";
  button.style.borderRadius = "18px";
  button.style.border = "none";
  button.style.background = "#272727";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";

  button.addEventListener("click", () => {
    enabled = !enabled;

    if (enabled) {
      applyFilter();
      button.textContent = "Show all";
    } else {
      clearFilter();
      button.textContent = "Bell channels";
    }
  });

  target.appendChild(button);

  return true;
}

const pageObserver = new MutationObserver(() => {
  insertButton();

  if (enabled) {
    applyFilter();
  }
});

pageObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

insertButton();
