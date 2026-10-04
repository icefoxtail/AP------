# AP Math Native Print Agent

This is a local test bridge for the archive's native print button. It listens only on
`127.0.0.1:43191` and submits jobs to the configured Windows printer queue.

It supports two test paths:

- RAW PCL: sends a 1-bit PCL raster stream directly to the queue. This remains as
  a diagnostic comparison path.
- GDI/DEVMODE: receives one lossless PNG per page, sets the installed driver's
  DEVMODE to A4, portrait, and duplex vertical/long-edge, then prints through
  `PrintDocument`. The driver supplies the actual imageable area and finishing.

## Run

From this folder, double-click `start-native-print-agent.cmd`, or run:

```powershell
start-native-print-agent.cmd
```

Keep the console window open while testing. The launcher compiles the small native
bridge with the .NET Framework compiler already present on Windows, then starts it.
The web page's native button reports an error instead of falling back silently if the
agent is not running.

The `빠른 인쇄` button uses the GDI/DEVMODE path. The older RAW PCL path remains
intentionally separate from the older orange RAW PCL test until physical duplex and
page-edge results are confirmed.

## One-time setup on another computer

The archive can download `APMath-Print-Agent-Installer.zip` when `빠른 인쇄` is
clicked without a running agent. Extract the ZIP and run
`install-native-print-agent.cmd` once on the Windows computer. It
downloads the current agent source, builds the local `winexe` agent under the
user's `%LOCALAPPDATA%`, registers it in the current user's Windows startup, and
starts it. No administrator permission is required unless the printer driver or
printer queue itself is missing.

This is deliberately a local test bridge. It binds to loopback and accepts only the
configured printer name. A production version should add a per-install token and a
proper installer before being distributed to other computers.
