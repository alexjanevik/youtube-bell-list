browser.action.onClicked.addListener(async (tab) => {
  await browser.tabs.sendMessage(tab.id, {
    type: "TOGGLE_BELL_LIST",
  });
});
