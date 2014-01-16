#!/bin/bash

php -f build_chrome.php

echo

git diff ../built | colordiff
