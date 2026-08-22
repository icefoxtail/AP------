# AP Math Native PCL Print Agent

This is a local test bridge for the archive's native print button. It listens only on
`127.0.0.1:43191`, accepts a PCL 5 monochrome raster stream, and submits it to the
configured Windows printer queue as a RAW job.

## Run

From this folder, double-click `start-native-print-agent.cmd`, or run:

```powershell
start-native-print-agent.cmd
```

Keep the console window open while testing. The launcher compiles the small native
bridge with the .NET Framework compiler already present on Windows, then starts it.
The web page's native button reports an error instead of falling back silently if the
agent is not running.

This is deliberately a local test bridge. It binds to loopback and accepts only the
configured printer name. A production version should add a per-install token and a
proper installer before being distributed to other computers.
