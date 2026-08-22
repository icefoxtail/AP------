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

The blue `Windows 드라이버 양면 테스트` button uses the GDI/DEVMODE path. It is
intentionally separate from the older orange RAW PCL test until physical duplex and
page-edge results are confirmed.

This is deliberately a local test bridge. It binds to loopback and accepts only the
configured printer name. A production version should add a per-install token and a
proper installer before being distributed to other computers.
