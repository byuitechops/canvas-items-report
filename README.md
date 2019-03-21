# canvas-items-report
Goes through a list of canvas courses and returns a report based on given inputs. (e.g. how many items/assignments exist after a certain date)

You must set up your Canvas API Token first:

canvas.apiToken = "<TOKEN>"
## Powershell
$env:CANVAS_API_TOKEN="<TOKEN>"

## CMD
set CANVAS_API_TOKEN=<TOKEN>

## Linux & Mac
export CANVAS_API_TOKEN="<TOKEN>"


run "node bin.js"
