const BELL_ALL_ICON = `
<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
  <path d="M19.395 1.196a1 1 0 00-.199 1.4A9 9 0 0121 8a1 1 0 002 0 11 11 0 00-2.205-6.605 1 1 0 00-1.4-.199Zm-16.192.2A11 11 0 001 8a1 1 0 002 0 9 9 0 011.803-5.404 1 1 0 00-1.6-1.2ZM12 1a7 7 0 00-7 7v4.446a1 1 0 01-.144.515L3.05 15.972C2.25 17.305 3.21 19 4.766 19H8a4 4 0 108 0h3.233c1.555 0 2.515-1.695 1.715-3.029l-1.805-3.01a1 1 0 01-.143-.515V8a7 7 0 00-7-7Zm0 2a5 5 0 015 5v4.445a3 3 0 00.428 1.545L19.233 17H4.766l1.806-3.01c.28-.466.428-1 .428-1.544V8a5 5 0 015-5Zm-2 16h4a2 2 0 01-4 0Z"/>
</svg>
`;

const BELL_OFF_ICON = `
<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
  <path d="M12 1a7 7 0 00-6.213 3.774l1.719 1.032A5 5 0 0117 8v3.502l2 1.199V8a7 7 0 00-7-7ZM1.141 5.485a1 1 0 00.343 1.372l3.514 2.109v3.48a1 1 0 01-.143.514L3.05 15.97c-.8 1.334.16 3.03 1.716 3.03H8a4 4 0 108 0l6-.001a1 1 0 00.515-1.856l-20-12a1 1 0 00-1.373.342ZM7 12.446v-2.28L18.39 17H4.766l1.806-3.011A3 3 0 007 12.446ZM10 19h4a2 2 0 01-4 0Z"/>
</svg>
`;

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
  } else {
    clearFilter();
  }
}

function insertButton() {
  const target = document.querySelector(
    "#header-container .ytd-section-list-renderer",
  );

  if (!target) {
    return false;
  }

  if (document.getElementById("yt-bell-filter-chip")) {
    target.style.display = "flex";
    return true;
  }

  target.appendChild(createBellChip());
  return true;
}

function createBellChip() {
  const chipView = document.createElement("chip-view-model");
  chipView.className = "ytChipViewModelHost";
  chipView.id = "yt-bell-filter-chip";

  chipView.innerHTML = `
    <chip-shape class="ytChipShapeHost">
      <button
        class="ytChipShapeButtonReset"
        type="button"
        aria-selected="false"
      >
        <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeEndIconPadding">
          <div class="yt-bell-filter-label">All Channels</div>

          <yt-touch-feedback-shape
            aria-hidden="true"
            class="ytSpecTouchFeedbackShapeHost ytSpecTouchFeedbackShapeTouchResponse"
          >
            <div class="ytSpecTouchFeedbackShapeStroke" style="border-radius: 8px;"></div>
            <div class="ytSpecTouchFeedbackShapeFill" style="border-radius: 8px;"></div>
          </yt-touch-feedback-shape>

          <span class="ytIconWrapperHost ytChipShapeIconEnd">
            <span class="yt-icon-shape ytSpecIconShapeHost">
              <div class="yt-bell-filter-icon">
                ${BELL_OFF_ICON}
              </div>
            </span>
          </span>
        </div>
      </button>
    </chip-shape>
  `;

  const button = chipView.querySelector("button");
  const label = chipView.querySelector(".yt-bell-filter-label");
  const icon = chipView.querySelector(".yt-bell-filter-icon");

  button.addEventListener("click", () => {
    enabled = !enabled;

    if (enabled) {
      applyFilter();
      button.setAttribute("aria-selected", "true");
      label.textContent = "Notified channels";
      icon.innerHTML = BELL_ALL_ICON;
    } else {
      clearFilter();
      button.setAttribute("aria-selected", "false");
      label.textContent = "All channels";
      icon.innerHTML = BELL_OFF_ICON;
    }
  });

  return chipView;
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

const style = document.createElement("style");
style.textContent = `
  #yt-bell-filter-chip .yt-bell-filter-icon {
    width: 24px;
    height: 24px;
    display: block;
    fill: currentColor;
  }

  #yt-bell-filter-chip svg {
    pointer-events: none;
    display: inherit;
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;
document.documentElement.appendChild(style);

insertButton();
