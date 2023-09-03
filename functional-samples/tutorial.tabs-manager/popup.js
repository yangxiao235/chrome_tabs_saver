// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


async function saveAllTabs() {
  let tabinfos = []
  const tabs = await chrome.tabs.query({});
  console.log("collect all tabs information");
  for (const _tab of tabs) {
    if (_tab.hasOwnProperty('title')) {
      tabinfos.push({title:_tab.title, url:_tab.url})
    }
  }
  let node = await chrome.bookmarks.search({title: "saved_tabs"})
  if (node.length == 0) {
    node = await chrome.bookmarks.create({parentId:"1", title: "saved_tabs"})
  } else {
    node = node[0]
  }
  let saved_tabs_id = node.id
  let new_folder = Date.now().toString()
  let new_folder_node = await chrome.bookmarks.create({parentId: saved_tabs_id, title: new_folder})
  let new_folder_id = new_folder_node.id
  
  console.log("begin saving the tabs");
  for (const tabinfo of tabinfos) {
    await chrome.bookmarks.create({parentId: new_folder_id, title: tabinfo.title, url: tabinfo.url})
  }
  console.log("save tabs complete");
}

await saveAllTabs()

if (false) {
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById('li_template');
const elements = new Set();
for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split('-')[0].trim();
  const pathname = new URL(tab.url).pathname.slice('/docs'.length);

  element.querySelector('.title').textContent = title;
  element.querySelector('.pathname').textContent = pathname;
  element.querySelector('a').addEventListener('click', async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}
document.querySelector('ul').append(...elements);

const button = document.querySelector('button');
button.addEventListener('click', async () => {
  const tabIds = tabs.map(({ id }) => id);
  if (tabIds.length) {
    const group = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(group, { title: 'DOCS' });
  }
});

}