#!/bin/bash

# Check if the src/ directory exists
if [ ! -d "src" ]; then
  echo "'src/' directory is missing."
  exit 1
fi

# Check if config.json exists
if [ ! -f "config.json" ]; then
  echo "'config.json' file is missing."
  exit 1
fi

# Validate that config.json is a valid JSON file
if ! jq empty config.json >/dev/null 2>&1; then
  echo "'config.json' is not valid JSON."
  exit 1
fi

echo "All checks passed!"#!/bin/bash

# Check if the src/ directory exists
if [ ! -d "src" ]; then
  echo "'src/' directory is missing."
  exit 1
fi

# Check if config.json exists
if [ ! -f "config.json" ]; then
  echo "'config.json' file is missing."
  exit 1
fi

# Validate that config.json is a valid JSON file
if ! jq empty config.json >/dev/null 2>&1; then
  echo "'config.json' is not valid JSON."
  exit 1
fi

echo "All checks passed!"

