# GCode-JSON-converter Changelog

## v0.0.1 (2017-03-16)
  First release with new versioning scheme.  

## v0.1.0 (2017-03-29)
  Added metacomment parsing

## v0.2.0 (2017-03-29)
  Added ability to pass a flag to disable comments from being appended to a line of gcode

## v0.2.1 (2017-03-29)
  Fixed bug where numbers were properly parsed, when passed as values

## v0.2.2 (2017-03-29)
  Fixed bug in converting object to GCode. F values were set as E values
  
## v1.0.0 (2017-04-18)
  Renamed "metaComment" to "commentTag"
  Transformed GcodeObject into a class and appended the toGcode function to it

