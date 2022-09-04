@echo off & cls

set _YARN_PATH_CLI="%userprofile%\AppData\Roaming\npm\yarn.cmd"

if exist %_YARN_PATH_CLI% (
  :: call "yarn" package manager.
  yarn test
)
