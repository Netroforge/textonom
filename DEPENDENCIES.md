# Textonom Dependencies

This document lists the system dependencies required to build and run Textonom.

## Required System Libraries

The following system libraries are required to build Textonom:

- gdk-3.0
- libsoup-3.0
- javascriptcoregtk-4.1
- pango
- atk

## Installation Instructions

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev libpango1.0-dev libatk1.0-dev
```

### Fedora

```bash
sudo dnf install gtk3-devel libsoup3-devel webkit2gtk4.1-devel pango-devel atk-devel
```

### Arch Linux

```bash
sudo pacman -S gtk3 libsoup3 webkit2gtk-5.0 pango atk
```

### macOS

```bash
brew install gtk+3 libsoup3 webkit2gtk pango atk
```

## Troubleshooting

If you encounter build errors related to missing libraries, ensure that:

1. All required system libraries are installed
2. The PKG_CONFIG_PATH environment variable is set correctly

For example, if libraries are installed in a non-standard location, you may need to set:

```bash
export PKG_CONFIG_PATH=/path/to/lib/pkgconfig
```

## Note for Windows Users

On Windows, these dependencies are typically bundled with the Tauri installer. If you encounter issues, please refer to the [Tauri documentation](https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-windows) for Windows-specific setup.
