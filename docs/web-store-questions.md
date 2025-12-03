# Chrome Web Store Listing

## 1. Store listing

### 1.1 Product details (for all languages)

---

**Description** (approx. 1,200 characters)

```
Quick Tab Opener helps you launch your favorite websites instantly with customizable keyboard shortcuts.

🚀 Key Features

- 9 URL Slots: Assign a single URL to each slot (e.g., Ctrl+1 to Ctrl+9)
- 9 URL Groups: Open up to 10 URLs at once per group (e.g., Ctrl+Shift+1 to Ctrl+Shift+9)
- Fully Customizable Shortcuts: Bind any key combination via chrome://extensions/shortcuts
- Pin Tabs by Default: Automatically pin opened tabs if you prefer
- Smart URL Handling: Domain-only input (e.g., "github.com") is auto-normalized to "https://github.com"
- Security First: Blocks dangerous URL schemes (javascript:, data:, file:, etc.)

💡 How It Works

1. Click the extension icon or press Ctrl+Shift+0 to open settings
2. Enter URLs in slots (single URLs) or groups (multiple URLs)
3. Assign keyboard shortcuts at chrome://extensions/shortcuts
4. Press your shortcut to instantly open the configured URL(s)

📌 Use Cases

- Developers: Open GitHub, Stack Overflow, and documentation tabs together
- Marketers: Launch analytics dashboards, social media, and ad platforms in one keystroke
- Students: Quickly access LMS, email, and research portals

No data is collected or transmitted. All settings are stored locally in your browser and synced via your Chrome account.

Open source: https://github.com/gakkunn/Ex-Chrome-quick-tab-opener
```

---

**Category**

```
Productivity
```

> Reason: This extension is designed to improve workflow efficiency by enabling users to quickly open frequently used websites via keyboard shortcuts.

---

**Language**

```
English
```

---

## 2. Privacy

### 2.1 Single purpose

**Single purpose description** (approx. 150 characters)

```
Open single URLs or groups of URLs using customizable keyboard shortcuts for faster access to frequently visited websites.
```

---

## 3. Permission justification

### 3.1 Storage justification

**storage justification** (approx. 300 characters)

```
The "storage" permission is required to save user-configured URL slots (1-9), URL groups (1-9, each containing up to 10 URLs), and the "pin by default" preference. Data is stored using chrome.storage.sync so settings persist across the user's devices. No data is transmitted externally.
```

---

### 3.2 Tabs justification

**tabs justification** (approx. 300 characters)

```
The "tabs" permission is required to:
1. Query the currently active tab to determine its position and window, so new tabs open adjacent to the active tab rather than at the end.
2. Create new tabs with the user-configured URLs when a keyboard shortcut is triggered.
No browsing history or tab content is accessed or stored.
```

---

### 3.3 Host permission justification

**Host permission justification**

```
This extension does not request any host permissions. No match patterns are specified in the manifest "permissions" or "content_scripts" fields. The extension only opens user-specified URLs in new tabs and does not inject content scripts or access page content.
```

> Note: If the Chrome Web Store form still requires this field, this explanation clarifies that no host permissions are used.

---

### 3.4 Remote code

**Are you using remote code?**

```
No, I am not using remote code
```

**Justification** (if required)

```
All JavaScript code is bundled locally within the extension package using esbuild at build time. No external scripts are loaded via <script> tags, no dynamic imports from external URLs, and no eval() or similar code evaluation is used. The extension is fully self-contained.
```

---

## 4. Data usage

**What user data do you plan to collect from users now or in the future?**

```
☐ None of the above

This extension does not collect any user data listed in the categories. All URL configurations and preferences are stored locally in chrome.storage.sync and are never transmitted to external servers.
```

> Note: None of the data categories apply to this extension. The URLs users configure are stored only in their browser's sync storage.

---

### 4.1 Developer certifications

_I certify that the following disclosures are true:_

```
☑ I do not sell or transfer user data to third parties, outside of the approved use cases.

☑ I do not use or transfer user data for purposes that are unrelated to my item's single purpose.

☑ I do not use or transfer user data to determine creditworthiness or for lending purposes.
```

> Rationale: This extension stores only user-entered URLs and a boolean preference locally. No data is transmitted to any server, sold, or used for any purpose other than opening tabs.

---

## 5. Privacy policy

**Privacy policy URL**

```
https://github.com/gakkunn/Ex-Chrome-quick-tab-opener/blob/main/PRIVACY_POLICY.md
```

> Alternative (if hosting externally): TODO: Replace with a hosted URL if required by Chrome Web Store (e.g., https://gakkunn.github.io/Ex-Chrome-quick-tab-opener/privacy-policy)

---

## 6. Test instructions

### 6.1 Credentials

**Username**

```
(Leave blank)
```

**Password**

```
(Leave blank)
```

> This extension does not require any login or authentication.

---

### 6.2 Additional instructions

**Additional instructions** (approx. 300 characters)

```
1. Click extension icon or press Ctrl+Shift+0 to open settings.
2. Enter any URL (e.g., "https://google.com") in Slot 1.
3. Click Save.
4. Go to chrome://extensions/shortcuts and assign a shortcut (e.g., Ctrl+1) to "Open URL in slot 1".
5. Press the shortcut to verify the URL opens in a new tab.
```

---

## Summary Checklist

| Item | Status |
|------|--------|
| Description | ✅ Ready |
| Category | ✅ Productivity |
| Language | ✅ English |
| Single purpose | ✅ Ready |
| storage permission justification | ✅ Ready |
| tabs permission justification | ✅ Ready |
| Host permission justification | ✅ Not applicable (no host permissions) |
| Remote code | ✅ No |
| Data usage | ✅ None collected |
| Developer certifications | ✅ All three |
| Privacy policy URL | ✅ GitHub link provided |
| Test instructions | ✅ Ready |

---

## Notes for Developer

1. **Privacy Policy Hosting**: The current privacy policy is on GitHub. Chrome Web Store accepts GitHub raw URLs, but consider hosting it on GitHub Pages for a cleaner URL.

2. **Screenshots**: Ensure you have the required promotional images:
   - Small promo tile: 440x280 px
   - Large promo tile: 1400x560 px (optional but recommended)
   - Screenshots: 1280x800 or 640x400 px

3. **Icons**: The manifest includes icons at 16px, 48px, and 128px as required.

4. **Manifest Version**: Using Manifest V3, which is the current requirement.

